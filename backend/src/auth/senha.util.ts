import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const TAMANHO_HASH = 64;

export async function criarHashSenha(senha: string): Promise<string> {
  const sal = randomBytes(16).toString('hex');
  const hash = (await scrypt(senha, sal, TAMANHO_HASH)) as Buffer;

  return `${sal}:${hash.toString('hex')}`;
}

export async function compararSenha(
  senha: string,
  senhaHash: string,
): Promise<boolean> {
  const [sal, hashSalvo] = senhaHash.split(':');

  if (!sal || !hashSalvo || !/^[0-9a-f]{128}$/i.test(hashSalvo)) {
    return false;
  }

  const hashEsperado = Buffer.from(hashSalvo, 'hex');
  const hashCalculado = (await scrypt(
    senha,
    sal,
    TAMANHO_HASH,
  )) as Buffer;

  return timingSafeEqual(hashEsperado, hashCalculado);
}