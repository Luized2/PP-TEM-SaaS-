import { useState, useCallback } from "react";

/**
 * Um hook customizado para gerir e alternar um estado booleano.
 * @param {boolean} initialState - O estado inicial (padrão: false).
 * @returns {[boolean, function, function, function]} Um array contendo: o estado atual, a função 'toggle', a função 'setTrue' e a função 'setFalse'.
 */
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  // A função 'toggle' é memoizada com useCallback para otimização,
  // garantindo que não seja recriada em cada renderização.
  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  // Funções explícitas para definir o estado como verdadeiro ou falso.
  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, toggle, setTrue, setFalse];
}

export default useToggle;
