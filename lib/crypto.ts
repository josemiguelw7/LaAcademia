import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Cifrado de la aplicación para datos fiscales (AES-256-GCM).
 *
 * Las llaves viven fuera de la base de datos, en variables de entorno del servidor:
 *   DATA_KEYS        JSON con llaves de 32 bytes en base64, por versión: {"1":"...","2":"..."}
 *   DATA_KEY_CURRENT versión con la que se cifra lo nuevo, p. ej. "1"
 * Rotar = agregar una versión nueva y cambiar DATA_KEY_CURRENT; lo viejo se sigue leyendo
 * con su versión y se puede re-cifrar después.
 *
 * Campos:   "v1.<k>.<iv>.<tag>.<texto cifrado>"  (base64url)
 * Archivos: [ "LA1" | k (1 byte) | iv (12) | tag (16) | texto cifrado ]
 */

const FIELD_PREFIX = "v1";
const FILE_MAGIC = Buffer.from("LA1");

function keyring(): { current: number; keys: Map<number, Buffer> } {
  const raw = process.env.DATA_KEYS;
  const cur = Number(process.env.DATA_KEY_CURRENT);
  if (!raw || !Number.isInteger(cur)) throw new Error("Faltan DATA_KEYS o DATA_KEY_CURRENT");
  const keys = new Map<number, Buffer>();
  for (const [v, b64] of Object.entries(JSON.parse(raw) as Record<string, string>)) {
    const k = Buffer.from(b64, "base64");
    if (k.length !== 32) throw new Error(`La llave ${v} no mide 32 bytes`);
    keys.set(Number(v), k);
  }
  if (!keys.has(cur)) throw new Error(`No existe la llave actual ${cur}`);
  if (cur < 1 || cur > 255) throw new Error("La versión de llave debe estar entre 1 y 255");
  return { current: cur, keys };
}

function keyFor(version: number): Buffer {
  const k = keyring().keys.get(version);
  if (!k) throw new Error(`No existe la llave ${version}`);
  return k;
}

/** Cifra un campo de texto (SSN, fecha de nacimiento, datos extraídos sensibles). */
export function encryptField(plain: string): string {
  const { current } = keyring();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", keyFor(current), iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [FIELD_PREFIX, current, iv.toString("base64url"), c.getAuthTag().toString("base64url"), ct.toString("base64url")].join(".");
}

export function decryptField(token: string): string {
  const [prefix, v, iv, tag, ct] = token.split(".");
  if (prefix !== FIELD_PREFIX || !ct) throw new Error("Formato de campo cifrado no válido");
  const d = createDecipheriv("aes-256-gcm", keyFor(Number(v)), Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(ct, "base64url")), d.final()]).toString("utf8");
}

/** Cifra un archivo antes de subirlo al depósito. Devuelve también el hash del original. */
export function encryptFile(plain: Buffer): { data: Buffer; keyVersion: number; sha256: string } {
  const { current } = keyring();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", keyFor(current), iv);
  const ct = Buffer.concat([c.update(plain), c.final()]);
  return {
    data: Buffer.concat([FILE_MAGIC, Buffer.from([current]), iv, c.getAuthTag(), ct]),
    keyVersion: current,
    sha256: createHash("sha256").update(plain).digest("hex"),
  };
}

export function decryptFile(blob: Buffer): Buffer {
  if (!blob.subarray(0, 3).equals(FILE_MAGIC)) throw new Error("Formato de archivo cifrado no válido");
  const v = blob[3];
  const iv = blob.subarray(4, 16);
  const tag = blob.subarray(16, 32);
  const d = createDecipheriv("aes-256-gcm", keyFor(v), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(blob.subarray(32)), d.final()]);
}

/** Para mostrar un SSN sin revelarlo: ***-**-1234 */
export const maskSsn = (last4: string | null) => (last4 ? `***-**-${last4}` : "—");

/** Hash del token de los enlaces del cliente: en la base solo se guarda esto. */
export const hashToken = (token: string) => createHash("sha256").update(token).digest();
export const newToken = () => randomBytes(32).toString("base64url");
