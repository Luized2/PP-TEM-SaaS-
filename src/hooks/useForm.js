import { useState, useCallback } from "react";

/**
 * Um hook customizado e robusto para gerir o estado, a validação e a submissão de formulários.
 * @param {object} initialValues - Os valores iniciais para os campos do formulário.
 * @param {object} validationRules - Um objeto com as regras de validação para cada campo.
 * @returns {object} Um objeto contendo os valores, erros, e funções para manipular o formulário.
 */
function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valida um único campo com base nas suas regras.
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      if (rules.required && (!value || String(value).trim() === "")) {
        return typeof rules.required === "string"
          ? rules.required
          : "Este campo é obrigatório";
      }
      if (rules.minLength && String(value).length < rules.minLength.value) {
        return (
          rules.minLength.message ||
          `Mínimo de ${rules.minLength.value} caracteres`
        );
      }
      if (rules.maxLength && String(value).length > rules.maxLength.value) {
        return (
          rules.maxLength.message ||
          `Máximo de ${rules.maxLength.value} caracteres`
        );
      }
      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return typeof rules.email === "string"
          ? rules.email
          : "Formato de email inválido";
      }
      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message || "Formato inválido";
      }
      if (rules.validate) {
        const customError = rules.validate(value, values);
        if (customError) return customError;
      }

      return "";
    },
    [validationRules, values]
  );

  // Valida todos os campos do formulário.
  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {};
    for (const fieldName in validationRules) {
      const error = validateField(fieldName, values[fieldName] || "");
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules, values]);

  // Manipulador para quando o valor de um campo muda.
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Valida em tempo real apenas se o campo já foi tocado.
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // Manipulador para quando um campo perde o foco.
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      // Marca o campo como "tocado".
      setTouched((prev) => ({ ...prev, [name]: true }));
      // Valida o campo ao perder o foco.
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  // Manipulador que envolve a sua função de submissão.
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();
      // Marca todos os campos como tocados para exibir todos os erros.
      const allTouched = Object.keys(validationRules).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      );
      setTouched(allTouched);

      if (validateForm()) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (submitError) {
          console.error("Erro na submissão do formulário:", submitError);
          // Poderia definir um erro de submissão geral aqui.
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validateForm, validationRules, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useForm;
