# Sistema de Cores do Site de Casamento

## 📁 Estrutura

```
src/theme/
├── index.ts          # Exportações principais
├── colors.ts         # Definição de cores
└── README.md         # Esta documentação
```

## 🎨 Cores Disponíveis

### Cores Primárias (Amarelo/Âmbar)
```typescript
import { colors } from '@/theme';

colors.primary[50]    // #fffbeb
colors.primary[100]   // #fef3c7
colors.primary[200]   // #fde68a
colors.primary[300]   // #fcd34d
colors.primary[400]   // #fbbf24
colors.primary[500]   // #f59e0b  ← PRINCIPAL
colors.primary[600]   // #d97706  ← ESCURO (textos/destaques)
colors.primary[700]   // #b45309
colors.primary[800]   // #92400e
colors.primary[900]   // #78350f
```

### Cores Secundárias (Azul Navy)
```typescript
colors.secondary[900]  // #1e3a8a  ← PRINCIPAL
colors.secondary[800]  // #1e40af
```

### Gradientes Pré-definidos
```typescript
import { gradients } from '@/theme';

gradients.primary           // Gradiente principal (amarelo)
gradients.primaryLight      // Gradiente claro (amarelo)
gradients.secondary         // Gradiente secundário (azul)
gradients.horizontal.primary // Gradiente horizontal
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
```

### Em Styled Components

```tsx
import { colors } from '@/theme';

const StyledButton = styled.button`
  background: ${colors.primary[500]};
  color: white;
  &:hover {
    background: ${colors.primary[600]};
  }
`;
```

### com Tailwind CSS

```tsx
// Use as classes do Tailwind normalmente
<div className="bg-amber-500 text-white">
  {/* ou combine com o sistema de cores */}
  <div style={{ color: colors.primary[600] }}>
    Texto personalizado
  </div>
</div>
```

## 🔄 Personalização

Para mudar a cor principal do site:

1. Abra `src/theme/colors.ts`
2. Altere os valores da propriedade `primary`
3. Todas as referências serão atualizadas automaticamente

**Exemplo - Mudar para Azul:**

```typescript
export const colors = {
  primary: {
    500: '#3b82f6',  // Era #f59e0b
    600: '#2563eb',  // Era #d97706
    // ... outros shades
  },
  // ...
};
```

## 📋 Padrões de Uso

- **Botões principais**: `gradients.primary`
- **Textos de destaque**: `colors.primary[600]`
- **Links**: `colors.primary[400]`
- **Bordas**: `colors.primary[500]`
- **Backgrounds suaves**: `colors.primary[100]`
- **Elementos secundários**: `gradients.secondary`

## 🎯 Benefícios

✅ **Centralização**: Todas as cores em um único lugar
✅ **Consistência**: Mesma cores em todo o site
✅ **Manutenção**: Altere em um lugar, muda em todos
✅ **TypeScript**: Autocompletar e type safety
✅ **Escalabilidade**: Fácil adicionar novas cores

## 📝 Notas

- As cores são baseadas no sistema Tailwind CSS
- Os valores hexadecimais seguem o padrão de 50 a 900
- Gradientes são pré-definidos para facilitar o uso
- O sistema é extensível para adicionar mais paletas
