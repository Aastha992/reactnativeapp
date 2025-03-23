
import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
      hazard1: {},
        hazard2: {},
        hazard3: {},
        hazard4: {},
        hazard5: {},
    });

    const updateFormData = (section, data) => {
      setFormData(prev => ({ ...prev, [section]: data }))
    };

    return (
      <FormContext.Provider value={{ formData, updateFormData }}>
         {children}
      </FormContext.Provider>
    );
 };
const useForm = () => useContext(FormContext);

export { FormProvider, useForm };