# Sequelize

## Migrations

make all commands in root of project -> apps/api/

### Create a new migration

ex (change name of the migration):

```bash
npx sequelize migration:generate --name create-users-table
```

### Run migrations

```bash
pnpm run migrate
```
