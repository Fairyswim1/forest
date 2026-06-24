const NICKNAME_PATTERN = /^[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)*$/u

export function validateNickname(raw: string):
  | { ok: true; value: string }
  | { ok: false; message: string } {
  const value = raw.trim()

  if (value.length < 2) {
    return { ok: false, message: '닉네임은 2자 이상 입력해 주세요.' }
  }

  if (value.length > 10) {
    return { ok: false, message: '닉네임은 10자까지 가능해요.' }
  }

  if (!NICKNAME_PATTERN.test(value)) {
    return { ok: false, message: '한글, 영문, 숫자만 사용할 수 있어요.' }
  }

  return { ok: true, value }
}
