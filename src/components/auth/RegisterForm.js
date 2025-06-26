// src/components/auth/RegisterForm.js
import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";

export default function RegisterForm() {
  const { formData, handleChange } = useForm({
    displayName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.displayName) newErrors.displayName = "O nome é obrigatório.";
    if (!formData.email) newErrors.email = "O email é obrigatório.";
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "A senha precisa ter no mínimo 6 caracteres.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register(formData.email, formData.password, formData.displayName);
      addNotification("Conta criada com sucesso! Bem-vindo(a)!", "success");
      navigate("/dashboard");
    } catch (error) {
      addNotification(error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Seu Nome"
        id="displayName"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        error={errors.displayName}
      />
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Senha"
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button type="submit" loading={loading} className="w-100 mt-3">
        Criar Conta
      </Button>
    </form>
  );
}
