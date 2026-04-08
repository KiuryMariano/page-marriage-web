# Sistema de Tema do Site de Casamento

## 📁 Estrutura

```
src/
├── theme/                    # Sistema de cores e gradientes
│   ├── index.ts             # Exportações principais
│   ├── colors.ts            # Definição de cores e gradientes
│   └── README.md            # Esta documentação
├── mocks/                   # Sistema de dados mock
│   ├── index.ts             # Barrel file (exportações centralizadas)
│   ├── gifts.ts             # Mock de presentes
│   ├── gallery.ts           # Mock de layout da galeria
│   └── README.md            # Documentação dos mocks
└── pages/                   # Páginas que usam theme e mocks
    ├── Presentes.tsx        # Usa gifts e colors
    └── Galeria.tsx          # Usa layoutPattern e colors
```

## 🎨 Sistema de Cores

### Cores Primárias (Amarelo/Âmbar)

```typescript
import { colors } from "@/theme";

colors.primary[50]; // #fffbeb
colors.primary[100]; // #fef3c7
colors.primary[200]; // #fde68a
colors.primary[300]; // #fcd34d
colors.primary[400]; // #fbbf24
colors.primary[500]; // #f59e0b  ← PRINCIPAL
colors.primary[600]; // #d97706  ← ESCURO (textos/destaques)
colors.primary[700]; // #b45309
colors.primary[800]; // #92400e
colors.primary[900]; // #78350f
```

### Cores Secundárias (Azul Navy)

```typescript
colors.secondary[900]; // #1e3a8a  ← PRINCIPAL
colors.secondary[800]; // #1e40af
```

### Cores de Ação

```typescript
colors.success.light;   // #34d399
colors.success.DEFAULT; // #10b981
colors.success.dark;    // #059669

colors.danger.light;    // #f87171
colors.danger.DEFAULT;  // #ef4444
colors.danger.dark;     // #dc2626
```

### Gradientes Pré-definidos

```typescript
import { gradients } from "@/theme";

gradients.primary;        // Gradiente principal (amarelo)
gradients.primaryLight;   // Gradiente claro (amarelo)
gradients.secondary;      // Gradiente secundário (azul)
gradients.secondaryLight; // Gradiente secundário claro
gradients.horizontal.primary;      // Horizontal (amarelo)
gradients.horizontal.primaryLight; // Horizontal claro (amarelo)
```

## 💡 Como Usar

### Em Componentes React

```tsx
import { colors, gradients } from '@/theme';

// Botão principal
<button
  style={{
    background: gradients.primary,
    color: 'white',
  }}
>
  Confirmar Presença
</button>

// Texto de destaque
<h1 style={{ color: colors.primary[600] }}>
  Título Importante
</h1>

// Borda colorida
<div style={{ borderColor: colors.primary[500] }}>
  Conteúdo
</div>

// Badge de cotas
<div style={{
  backgroundColor: colors.primary[100],
  borderColor: colors.primary[200]
}}>
  <span style={{ color: colors.primary[700] }}>
    Cota única
  </span>
</div>
```

### com Tailwind CSS

```tsx
// Use as classes do Tailwind normalmente
<div className="bg-amber-500 text-white">
  {/* ou combine com o sistema de cores */}
  <div style={{ color: colors.primary[600] }}>Texto personalizado</div>
</div>
```

## 🎭 Sistema de Mocks

### Usando Mocks de Presentes

```typescript
import { gifts, type Gift } from "@/mocks";

// gifts é um array de Gift[]
// Interface Gift:
interface Gift {
  id: number;
  title: string;
  price: number;        // preço em reais (ex: 500)
  image?: string;       // URL da imagem
  cotas: number;        // número de cotas (1 = cota única)
}

// Exemplo de uso
{gifts.map((gift) => (
  <div key={gift.id}>
    <h3>{gift.title}</h3>
    <p>{formatPrice(gift.price)}</p>
    <span>{gift.cotas === 1 ? 'Cota única' : `${gift.cotas} cotas`}</span>
  </div>
))}
```

### Usando Mocks de Galeria

```typescript
import { layoutPattern } from "@/mocks";

// layoutPattern é um array de strings: 'H', 'V', 'N'
// H = horizontal (col-span-2)
// V = vertical (row-span-2)
// N = normal (1x1)

// Exemplo de uso
{layoutPattern.map((type, index) => {
  const photo = photos[index];
  return (
    <div
      key={photo.id}
      className={`
        ${type === 'H' ? 'col-span-2' : ''}
        ${type === 'V' ? 'row-span-2' : ''}
      `}
    >
      <img src={photo.url} alt={photo.alt} />
    </div>
  );
})}
```

## 📋 Padrões de Uso

- **Botões principais**: `gradients.primary`
- **Textos de destaque**: `colors.primary[600]`
- **Links**: `colors.primary[400]`
- **Bordas**: `colors.primary[500]`
- **Backgrounds suaves**: `colors.primary[100]`
- **Elementos secundários**: `gradients.secondary`
- **Badges/cotas**: `colors.primary[100]` (bg), `colors.primary[700]` (text)

## 🔄 Personalização

### Mudar Cores

1. Abra `src/theme/colors.ts`
2. Altere os valores da propriedade desejada
3. Todas as referências serão atualizadas automaticamente

**Exemplo - Mudar para Azul:**

```typescript
export const colors = {
  primary: {
    500: "#3b82f6", // Era #f59e0b
    600: "#2563eb", // Era #d97706
    // ... outros shades
  },
  // ...
};
```

### Adicionar Novos Mocks

1. Crie um arquivo em `src/mocks/`
2. Exporte os dados e interfaces
3. Adicione export em `src/mocks/index.ts`

**Exemplo:**

```typescript
// src/mocks/rsvp.ts
export interface RSVP {
  id: number;
  name: string;
  confirmed: boolean;
}

export const rsvps: RSVP[] = [
  { id: 1, name: "João", confirmed: true },
  // ...
];

// src/mocks/index.ts
export * from './rsvp';
```

## 🎯 Benefícios

✅ **Centralização**: Todas as cores e dados em um único lugar
✅ **Consistência**: Mesmas cores em todo o site
✅ **Manutenção**: Altere em um lugar, muda em todos
✅ **TypeScript**: Autocompletar e type safety
✅ **Escalabilidade**: Fácil adicionar novas cores e mocks
✅ **Separação**: Dados separados da UI

## 📝 Notas

- As cores são baseadas no sistema Tailwind CSS
- Os valores hexadecimais seguem o padrão de 50 a 900
- Gradientes são pré-definidos para facilitar o uso
- O sistema é extensível para adicionar mais paletas
- Mocks usam TypeScript para type safety
- Barrel file (`index.ts`) centraliza exportações
