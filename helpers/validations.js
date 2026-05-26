export const isRequired = value => {

    return (
        value &&
        value.trim() !== ""
    );
};

export const isEmail = email => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
};

export const isPasswordValid = password => {

    return (
        password &&
        password.length >= 4
    );
};

export const passwordsMatch =
    (password, confirmPassword) => {

        return (
            password === confirmPassword
        );
    };

export const isRatingValid =
    valor => {

        return (
            valor >= 1 &&
            valor <= 5
        );
    };