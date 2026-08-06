import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthGuard } from "../hooks/useAuth";

interface Presente {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  imagem_url: string | null;
  cotas_totais: number;
  cotas_disponiveis: number;
  cotas_vendidas: number;
  status_cotas: string;
  ativo: number;
}

type ModalMode = "create" | "edit" | null;

const CATEGORIAS = [
  { value: "eletros", label: "Eletrodomésticos" },
  { value: "casa", label: "Casa" },
  { value: "divertidos", label: "Divertidos" },
  { value: "utensilios", label: "Utensílios" },
  { value: "vales", label: "Vales" },
];

const STATUS_COLORS: Record<string, string> = {
  disponivel: "bg-green-100 text-green-800",
  poucas_cotas: "bg-yellow-100 text-yellow-800",
  esgotado: "bg-red-100 text-red-800",
};

const formatPrice = (value: string) => {
  return parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const Admin = () => {
  const isAuthenticated = useAuthGuard();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPresente, setSelectedPresente] = useState<Presente | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria: "casa",
    imagem_url: "",
    cotas_totais: 10,
    cotas_disponiveis: 10,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, nome: string): Promise<string | null> => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('imagem', file);
      formData.append('nome', nome);

      const response = await fetch('/api/presentes/upload-image.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        return result.data.path;
      } else {
        showNotification('error', result.error || 'Erro ao fazer upload');
        return null;
      }
    } catch {
      showNotification('error', 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/presentes/delete-image.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        showNotification('error', result.error || 'Erro ao deletar imagem');
        return false;
      }
    } catch {
      showNotification('error', 'Erro ao deletar imagem do servidor');
      return false;
    }
  };

  const fetchPresentes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/presentes/list.php");
      const data = await response.json();
      if (data.success) {
        setPresentes(data.data);
      }
    } catch {
      showNotification("error", "Erro ao carregar presentes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPresentes();
    }
  }, [isAuthenticated, fetchPresentes]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormData({
      nome: "",
      preco: "",
      categoria: "casa",
      imagem_url: "",
      cotas_totais: 10,
      cotas_disponiveis: 10,
    });
    setImageFile(null);
    setImagePreview(null);
    setModalMode("create");
  };

  const handleOpenEdit = (presente: Presente) => {
    setSelectedPresente(presente);
    setFormData({
      nome: presente.nome,
      preco: presente.preco,
      categoria: presente.categoria,
      imagem_url: presente.imagem_url || "",
      cotas_totais: presente.cotas_totais,
      cotas_disponiveis: presente.cotas_disponiveis,
    });
    setImageFile(null);
    setImagePreview(presente.imagem_url || null);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedPresente(null);
    setFormData({
      nome: "",
      preco: "",
      categoria: "casa",
      imagem_url: "",
      cotas_totais: 10,
      cotas_disponiveis: 10,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imagePath = formData.imagem_url;

      // Fazer upload se houver arquivo selecionado
      if (imageFile) {
        const uploadedPath = await uploadImage(imageFile, formData.nome);
        if (uploadedPath) {
          imagePath = uploadedPath;
        } else {
          setSaving(false);
          return;
        }
      }

      const data = {
        ...formData,
        imagem_url: imagePath,
        preco: parseFloat(formData.preco),
      };

      if (modalMode === "create") {
        const response = await fetch("/api/presentes/create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();

        if (result.success) {
          showNotification("success", "Presente criado com sucesso");
          handleCloseModal();
          fetchPresentes();
        } else {
          showNotification("error", result.error || "Erro ao criar presente");
        }
      } else if (modalMode === "edit" && selectedPresente) {
        const response = await fetch("/api/presentes/update.php", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedPresente.id,
            ...data,
          }),
        });
        const result = await response.json();

        if (result.success) {
          showNotification("success", "Presente atualizado com sucesso");
          handleCloseModal();
          fetchPresentes();
        } else {
          showNotification("error", result.error || "Erro ao atualizar presente");
        }
      }
    } catch {
      showNotification("error", "Erro na operação");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja desativar este presente?")) {
      return;
    }

    try {
      const response = await fetch(`/api/presentes/delete.php?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        showNotification("success", "Presente desativado com sucesso");
        fetchPresentes();
      } else {
        showNotification("error", result.error || "Erro ao desativar presente");
      }
    } catch {
      showNotification("error", "Erro na operação");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Administração</h1>
              <p className="text-gray-600 mt-1">Gerencie os presentes disponíveis</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar ao site
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Presente
              </button>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg ${
                notification.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Total de Presentes</p>
              <p className="text-2xl font-bold text-gray-800">{presentes.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Disponíveis</p>
              <p className="text-2xl font-bold text-green-600">
                {presentes.filter((p) => p.status_cotas === "disponivel").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Poucas Cotas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {presentes.filter((p) => p.status_cotas === "poucas_cotas").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <p className="text-sm text-gray-600">Esgotados</p>
              <p className="text-2xl font-bold text-red-600">
                {presentes.filter((p) => p.status_cotas === "esgotado").length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Imagem</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Preço</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Categoria</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Cotas</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          Carregando...
                        </div>
                      </td>
                    </tr>
                  ) : presentes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        Nenhum presente encontrado
                      </td>
                    </tr>
                  ) : (
                    [...presentes].sort((a, b) => a.id - b.id).map((presente) => (
                      <tr key={presente.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">#{presente.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">
                          {presente.nome}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                          {presente.imagem_url || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">{formatPrice(presente.preco)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{presente.categoria}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">
                          {presente.cotas_disponiveis}/{presente.cotas_totais}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              STATUS_COLORS[presente.status_cotas] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {presente.status_cotas === "disponivel"
                              ? "Disponível"
                              : presente.status_cotas === "poucas_cotas"
                                ? "Poucas cotas"
                                : "Esgotado"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(presente)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(presente.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Desativar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Create/Edit */}
      {modalMode && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {modalMode === "create" ? "Novo Presente" : "Editar Presente"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Presente *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {CATEGORIAS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem do Presente
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Aceita qualquer formato de imagem</p>
                </div>

                {imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preview
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          // Deletar a imagem do servidor
                          if (formData.imagem_url) {
                            const deleted = await deleteImage(formData.imagem_url);
                            if (deleted) {
                              // Só limpa os campos se a deleção foi bem-sucedida
                              setImageFile(null);
                              setImagePreview(null);
                              setFormData({ ...formData, imagem_url: "" });
                              showNotification("success", "Imagem removida com sucesso");
                            }
                            // Se não foi bem-sucedida, o erro já foi mostrado pelo deleteImage
                          } else {
                            // Se não tem URL, apenas limpa os campos locais
                            setImageFile(null);
                            setImagePreview(null);
                            setFormData({ ...formData, imagem_url: "" });
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remover imagem
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cotas Totais *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.cotas_totais}
                      onChange={(e) => setFormData({
                        ...formData,
                        cotas_totais: parseInt(e.target.value) || 1,
                        cotas_disponiveis: Math.min(formData.cotas_disponiveis, parseInt(e.target.value) || 1),
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cotas Disponíveis *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.cotas_totais}
                      value={formData.cotas_disponiveis}
                      onChange={(e) => setFormData({ ...formData, cotas_disponiveis: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={saving || uploading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Fazendo upload..." : saving ? "Salvando..." : modalMode === "create" ? "Criar Presente" : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
