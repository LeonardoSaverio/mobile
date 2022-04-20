interface Error {
    message: string;
    code: string;
}

export const firebaseAccountValidator = (error: Error): string => {
    if (error.code === 'auth/invalid-email' ) {
        return 'E-mail inválido.';
    } else if (error.code === 'auth/weak-password') {
        return 'A senha deve possuir no mínimo 6 caracteres.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'){
        return 'Usúario não encontrado'
    } else if (error.code === 'auth/user-disabled'){
        return 'Usuário desativado'
    }
    return error.message;
}


