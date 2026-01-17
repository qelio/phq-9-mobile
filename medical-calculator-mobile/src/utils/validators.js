// src/utils/validators.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validatePhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone.replace(/\s/g, ''));
};

export const validateName = (name) => {
    return name.trim().length >= 2;
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateDate = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

export const getValidationErrors = (fields, values) => {
    const errors = {};

    fields.forEach((field) => {
        const { name, label, rules } = field;
        const value = values[name];

        for (const rule of rules) {
            if (rule === 'required' && !validateRequired(value)) {
                errors[name] = `${label} обязательно`;
                break;
            }

            if (rule === 'email' && !validateEmail(value)) {
                errors[name] = 'Некорректный email';
                break;
            }

            if (rule === 'password' && !validatePassword(value)) {
                errors[name] = 'Минимум 6 символов';
                break;
            }

            if (rule === 'phone' && !validatePhone(value)) {
                errors[name] = 'Некорректный телефон';
                break;
            }

            if (rule === 'name' && !validateName(value)) {
                errors[name] = 'Минимум 2 символа';
                break;
            }

            if (rule.startsWith('minLength:') && value) {
                const minLength = parseInt(rule.split(':')[1], 10);
                if (value.length < minLength) {
                    errors[name] = `Минимум ${minLength} символов`;
                    break;
                }
            }

            if (rule.startsWith('maxLength:') && value) {
                const maxLength = parseInt(rule.split(':')[1], 10);
                if (value.length > maxLength) {
                    errors[name] = `Максимум ${maxLength} символов`;
                    break;
                }
            }

            if (rule === 'date' && !validateDate(value)) {
                errors[name] = 'Некорректная дата';
                break;
            }
        }
    });

    return errors;
};