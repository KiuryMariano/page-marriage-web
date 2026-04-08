# Sistema de Mocks - Site de Casamento

## 📁 Estrutura

```
src/mocks/
├── index.ts      # Barrel file (exportações centralizadas)
├── gifts.ts      # Mock de presentes
└── gallery.ts    # Mock de layout da galeria
```

## 🎁 Mock de Presentes (`gifts.ts`)

### Interface Gift

```typescript
interface Gift {
  id: number;          // Identificador único
  title: string;       // Nome do presente
  price: number;       // Preço em reais (ex: 500, não "R$ 500")
  image?: string;      // URL da imagem (opcional)
  cotas: number;       // Número de cotas disponíveis
}
```

### Exemplo de Uso

```typescript
import { gifts, type Gift } from "@/mocks";

// Listar todos os presentes
gifts.map((gift: Gift) => {
  console.log(gift.title);        // "PS5 para o Noivo"
  console.log(gift.price);        // 1500
  console.log(gift.cotas);        // 2
  console.log(gift.image);        // "https://..."
});

// Filtrar presentes com múltiplas cotas
const multiCota = gifts.filter(g => g.cotas > 1);

// Encontrar presente por ID
const gift = gifts.find(g => g.id === 1);
```

### Formatação de Preço

```typescript
const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

// Exemplos:
formatPrice(500);    // "R$ 500,00"
formatPrice(1500);   // "R$ 1.500,00"
formatPrice(0.01);   // "R$ 0,01"
```

### Exibição de Cotas

```typescript
// Texto para exibição
const getCotasText = (cotas: number) => {
  return cotas === 1 ? 'Cota única' : `${cotas} cotas`;
};

// Badge de cotas
<div className="badge-cotas">
  <span>{getCotasText(gift.cotas)}</span>
</div>
```

## 🖼️ Mock de Galeria (`gallery.ts`)

### Layout Pattern

```typescript
const layoutPattern: ('H' | 'V' | 'N')[];
```

**Tipos de posição:**
- `'H'` - Horizontal (col-span-2): foto larga
- `'V'` - Vertical (row-span-2): foto alta
- `'N'` - Normal (1x1): foto quadrada

### Exemplo de Uso

```typescript
import { layoutPattern } from "@/mocks";

// Mapear layout para fotos
layoutPattern.map((type, index) => {
  const photo = photos[index];

  return (
    <div
      key={photo.id}
      className={`
        ${type === 'H' ? 'col-span-2' : 'col-span-1'}
        ${type === 'V' ? 'row-span-2' : 'row-span-1'}
      `}
    >
      <img src={photo.url} alt={photo.alt} />
    </div>
  );
});
```

### Grid Layout

```css
/* Grid de 4 colunas com altura automática */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 280px; /* ou 325px em telas maiores */
  gap: 0.5rem;
}
```

## 🔧 Barrel File (`index.ts`)

### Exportações Centralizadas

```typescript
// Em vez de:
import { gifts } from "@/mocks/gifts";
import { layoutPattern } from "@/mocks/gallery";

// Use:
import { gifts, layoutPattern, type Gift } from "@/mocks";
```

### O que é exportado

```typescript
// Do gifts.ts
export { gifts, type Gift };

// Do gallery.ts
export { layoutPattern };
```

## 📊 Dados Atuais

### Presentes (Total: 20)

**Presentes com múltiplas cotas:**
- Parcela da Festa de Casamento (20 cotas)
- PS5 para o Noivo (2 cotas)
- Parcela do Kit Turbo (10 cotas)
- Parcela do Vestido da Noiva (10 cotas)
- Geladeira (15 cotas)

**Presentes de cota única:**
- Coberta para Noiva
- Microondas
- Cafeteira
- Pipoqueira
- Chaleira Elétrica
- E outros...

### Layout da Galeria (Total: 42 posições)

```typescript
// Distribuição:
// - 8 posições horizontais (H)
// - 6 posições verticais (V)
// - 28 posições normais (N)

// Padrão repetido 4x:
['H', 'H', 'V', 'N', 'V', 'N', 'N', 'N', 'N', 'N']
```

## 🎯 Boas Práticas

### 1. Type Safety

```typescript
// ✅ Bom - usa tipo
import { gifts, type Gift } from "@/mocks";

const gift: Gift = {
  id: 1,
  title: "Presente",
  price: 100,
  image: "url",
  cotas: 1
};

// ❌ Ruim - sem tipo
const gift = {
  id: 1,
  title: "Presente"
};
```

### 2. Imutabilidade

```typescript
// ✅ Bom - cria cópia
const updatedGift = { ...gift, title: "Novo título" };

// ❌ Ruim - modifica original
gift.title = "Novo título";
```

### 3. Formatação

```typescript
// ✅ Bom - usa formatador
<span>{formatPrice(gift.price)}</span>

// ❌ Ruim - formatação manual
<span>R$ {gift.price},00</span>
```

## 🔄 Integração com Backend

### Preparação para API

```typescript
// Futuramente, substituir mock por API:
import { getGifts } from '@/api/gifts';

// Hooks personalizados:
const useGifts = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    getGifts().then(setGifts);
  }, []);

  return { gifts };
};
```

### Campos a Adicionar

```typescript
interface Gift {
  id: number;
  title: string;
  price: number;
  image?: string;
  cotas: number;

  // Campos futuros:
  cotasPagas?: number;      // Cotas já pagas
  categoria?: string;       // Categoria do presente
  descricao?: string;       // Descrição detalhada
  ativo?: boolean;          // Se está disponível
}
```

## 📝 Notas

- Todos os IDs devem ser únicos
- Preços devem ser números, não strings
- Imagens devem ser URLs válidas
- Cotas mínimas: 1
- Layout da galeria fixo em 42 posições
- Tipos exportados para TypeScript
