<?php
/**
 * ============================================
 * Conexão com Banco de Dados - Casamento
 * ============================================
 *
 * Configure suas credenciais abaixo
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'casamento_db');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
define('DB_CHARSET', 'utf8mb4');

function getConnection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                DB_HOST,
                DB_NAME,
                DB_CHARSET
            );

            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            error_log('[DB_ERROR] ' . $e->getMessage());
            throw new RuntimeException('Erro ao conectar ao banco.');
        }
    }

    return $pdo;
}

function dbFetchAll(string $query, array $params = []): array
{
    $stmt = getConnection()->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function dbFetchOne(string $query, array $params = []): ?array
{
    $stmt = getConnection()->prepare($query);
    $stmt->execute($params);
    $result = $stmt->fetch();
    return $result ?: null;
}

function dbExecute(string $query, array $params = []): bool
{
    $stmt = getConnection()->prepare($query);
    return $stmt->execute($params);
}

function dbLastInsertId(): string
{
    return getConnection()->lastInsertId();
}

/**
 * Busca todos os presentes ativos (em ordem randomica)
 */
function getPresentesAtivos(): array
{
    return dbFetchAll("
        SELECT
            id, nome, preco, categoria,
            cotas_totais, cotas_disponiveis,
            (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
            CASE
                WHEN cotas_disponiveis = 0 THEN 'esgotado'
                WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                ELSE 'disponivel'
            END AS status_cotas
        FROM presentes
        WHERE ativo = 1
        ORDER BY RAND()
    ");
}

/**
 * Busca presentes por categoria
 */
function getPresentesPorCategoria(string $categoria): array
{
    return dbFetchAll("
        SELECT
            id, nome, preco, categoria,
            cotas_totais, cotas_disponiveis,
            (cotas_totais - cotas_disponiveis) AS cotas_vendidas,
            CASE
                WHEN cotas_disponiveis = 0 THEN 'esgotado'
                WHEN cotas_disponiveis < (cotas_totais * 0.2) THEN 'poucas_cotas'
                ELSE 'disponivel'
            END AS status_cotas
        FROM presentes
        WHERE ativo = 1 AND categoria = ?
        ORDER BY RAND()
    ", [$categoria]);
}

/**
 * Busca todas as categorias com estatísticas
 */
function getCategorias(): array
{
    return dbFetchAll("
        SELECT
            categoria,
            COUNT(*) AS total_presentes,
            SUM(cotas_totais) AS total_cotas_geral,
            SUM(cotas_disponiveis) AS total_cotas_disponiveis,
            SUM(cotas_totais - cotas_disponiveis) AS total_cotas_vendidas,
            ROUND(AVG(preco), 2) AS preco_medio
        FROM presentes
        WHERE ativo = 1
        GROUP BY categoria
        ORDER BY categoria
    ");
}

/**
 * Lista de todas as categorias disponíveis
 */
function getListaCategorias(): array
{
    return [
        'eletros' => 'Eletros',
        'casa' => 'Casa',
        'divertidos' => 'Divertidos',
        'utensilios' => 'Utensílios',
        'vales' => 'Vales',
    ];
}

/**
 * Busca preço de um presente por ID
 */
function getPrecoPresente(int $id): ?float
{
    $result = dbFetchOne("SELECT preco FROM presentes WHERE id = ?", [$id]);
    return $result ? (float) $result['preco'] : null;
}

/**
 * Registra uma venda (diminui cotas automaticamente via trigger)
 */
function registrarVenda(int $presenteId, int $quantidade, string $metodoPagamento): bool
{
    $preco = getPrecoPresente($presenteId);

    if (!$preco) {
        return false;
    }

    return dbExecute("
        INSERT INTO vendas (presente_id, quantidade, preco_unitario, subtotal, metodo_pagamento)
        VALUES (?, ?, ?, ?, ?)
    ", [$presenteId, $quantidade, $preco, $preco * $quantidade, $metodoPagamento]);
}

/**
 * Registra múltiplas vendas (para carrinho com vários itens)
 */
function registrarVendas(array $itens, string $metodoPagamento): bool
{
    $pdo = getConnection();

    try {
        $pdo->beginTransaction();

        foreach ($itens as $item) {
            $presenteId = (int) $item['id'];
            $quantidade = (int) $item['quantity'];
            $preco = getPrecoPresente($presenteId);

            if (!$preco) {
                throw new RuntimeException("Presente {$presenteId} não encontrado");
            }

            $stmt = $pdo->prepare("
                INSERT INTO vendas (presente_id, quantidade, preco_unitario, subtotal, metodo_pagamento)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$presenteId, $quantidade, $preco, $preco * $quantidade, $metodoPagamento]);
        }

        $pdo->commit();
        return true;
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('[REGISTRAR_VENDAS] ' . $e->getMessage());
        return false;
    }
}
