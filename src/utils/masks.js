export const onlyDigits = (v = "") => v.replace(/\D+/g, "");

export const maskCNPJ = (v) =>
    onlyDigits(v)
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/(\d{4})(\d)/, "$1-$2");

export const maskCEP = (v) =>
    onlyDigits(v)
        .slice(0, 8)
        .replace(/^(\d{5})(\d)/, "$1-$2");
