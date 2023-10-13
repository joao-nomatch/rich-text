## Visualizar projeto

Clone o projeto, baixe as dependências (`pnpm i`) e inicie o servidor (`pnpm run dev`)


## Utilizar componente
Para utilizar o compoente de editor de texto em outro projeto React, siga os passos a seguir:

1. Crie um novo projeto no [Supabase](https://supabase.com/dashboard/projects)

2. Vá até as configurações do projeto, copie a url do projeto e a chave da API (Anon Key) e coloque no arquivo `.env` como `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_ANON_KEY` respectivamente.

3. Crie uma nova tabela com as seguintes colunas e tipagem (o RLS deve estar desabilitado para deixar a tabela pública):
    - id (valor padrão)
    - created_at (valor padrão)
    - text (text)
    - img_url (text)
    - author (text)

4. Crie um bucket público e adicione uma nova política a ele, permitindo select, insert, update e delete.

5. Copie o arquivo do componente `rich-text.tsx`

6. Baixe as pedendências usadas no componente:
    - `@supabase/supabase-js`
    - `@supabase/auth-ui-react`
    -  `@supabase/auth-ui-shared`
    -  `uuid`
    -  `@types/uuid`
    -  `tailwind`
    -  `react-hook-form`
    -  `@hookform/resolvers`
    -  `zod`
    -  `chadcn/ui` (toast)

7. Por fim, defina as variáveis `bucketName`, `tableName` e `projectId` com seu respectivo valores. 

```
Disclaimer: Deve ter uma maneira melhor de usar os valores do último tópico para definir a url da requisição, mas por enquanto foi a forma que encontrei.
```

Obs: Para utilizar o  editor é necessário fazer um cadastro com email. Quando o usuário subir a imagem, será criada uma pasta dentro do bucket com seu id que apenas ela pode acessar.