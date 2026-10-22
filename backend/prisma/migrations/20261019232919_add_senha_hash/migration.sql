ALTER TABLE "Usuario"
ADD COLUMN "senhaHash" TEXT NOT NULL
DEFAULT ('legacy:' || repeat('0', 128));

ALTER TABLE "Usuario"
ALTER COLUMN "senhaHash" DROP DEFAULT;