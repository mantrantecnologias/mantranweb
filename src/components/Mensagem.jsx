import Swal from "sweetalert2";

const swalSmall = {
    customClass: {
        popup: 'swal-small-popup'
    },
};

export function successMessage(textMessage) {
    Swal.fire({
        ...swalSmall,
        title: "Sucesso!",
        text: textMessage,
        icon: "success",
        confirmButtonColor: "#1dc426ff"
    });
}

export function confirmMessage(title, text) {
    return Swal.fire({
        ...swalSmall,
        title,
        text,
        icon: "question",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Sim",
        confirmButtonColor: "#3085d6",
        denyButtonText: "Não",
        denyButtonColor: "#3085d6",
    });
}

export function errorMessage(error) {
    Swal.fire({
        ...swalSmall,
        title: "Erro",
        text: error,
        icon: "error",
    });
}

export function infoMessage(info) {
    Swal.fire({
        ...swalSmall,
        title: "",
        text: info,
        icon: "info",
        iconColor: '#17a2b8'
    });
}

export function passwordMessage(title, label) {
    return Swal.fire({
        ...swalSmall,
        title: title,
        html: `<div style="text-align: left; margin-bottom: 5px;"><label style="font-size: 14px; color: #555;">${label}</label></div>`,
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: "Alterar",
        confirmButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
    });
}
