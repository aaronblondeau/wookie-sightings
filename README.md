# wookie-sightings

This is an example app which demonstrates how to add custom field editors to Kottster.

## Getting started

Install dependencies

```
pnpm install
```

Create an .env file

```
cp .env.example .env
```

TODO - instructions for updating S3 env vars.

Setup database (note DB_FILE_NAME in .env)

```
npx drizzle-kit push
```

Run Kottster

```
pnpm dev
```

## Blog post

This repo is for a blog post I wrote : TODO - url

1. Create a new kottster project

https://kottster.app/docs/

2. Install mantine (will need this later)

pnpm add @mantine/hooks @mantine/core
pnpm add lucide-react

3. Install drizzle (sqlite)

pnpm add drizzle-orm @libsql/client dotenv
pnpm add -D drizzle-kit tsx

) Install leaflet (also needed later)

pnpm add leaflet react-leaflet@next
pnpm add -D @types/leaflet

4. Create .env

DB_FILE_NAME=file:wookie-sightings.db

5. Create schema.ts (skip index.ts in drizzle instructions)

6. Create drizzle.config.ts

7. Run drizzle push

npx drizzle-kit push

8. Launch kottster

9. Create username and password

10. Connect to to db

11. Add page for users

- Create a user

12. Add page for sightings

13. Note that location and photo are not exactly editable here...

14. Create index.tsx in pages/sightings
