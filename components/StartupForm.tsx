"use client"

import { useReducer, useCallback, useState, useTransition, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { TagInput, Tag } from "@/components/ui/tag-input"
import { createStartup } from "@/data/startup"

interface StartupFormProps {
  tags: Tag[];
}

// Form reducer for more efficient state management
type FormState = {
  name: string;
  description: string;
  selectedTags: Tag[];
  images: { id: string; url: string }[];
  formErrors: {
    name?: string;
    description?: string;
    tags?: string;
  };
  error: string | null;
  showSuccessToast: boolean;
}

type FormAction = 
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_TAGS'; payload: Tag[] }
  | { type: 'SET_IMAGES'; payload: { id: string; url: string }[] }
  | { type: 'SET_FORM_ERRORS'; payload: FormState['formErrors'] }
  | { type: 'CLEAR_ERROR'; field?: keyof FormState['formErrors'] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SUCCESS_TOAST'; payload: boolean }
  | { type: 'RESET_FORM' };

const initialFormState: FormState = {
  name: "",
  description: "",
  selectedTags: [],
  images: [],
  formErrors: {},
  error: null,
  showSuccessToast: false
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_TAGS':
      return { ...state, selectedTags: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'SET_FORM_ERRORS':
      return { ...state, formErrors: action.payload };
    case 'CLEAR_ERROR':
      if (action.field) {
        const newErrors = { ...state.formErrors };
        delete newErrors[action.field];
        return { ...state, formErrors: newErrors };
      }
      return { ...state, formErrors: {} };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SUCCESS_TOAST':
      return { ...state, showSuccessToast: action.payload };
    case 'RESET_FORM':
      return { ...initialFormState };
    default:
      return state;
  }
}

// Field component to reduce re-renders
const FormField = ({ 
  label, 
  error, 
  children 
}: { 
  label: string; 
  error?: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label htmlFor={label.toLowerCase()}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default function StartupForm({ tags }: StartupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  
  const validateForm = useCallback(() => {
    const errors: FormState['formErrors'] = {};
    let isValid = true;
    
    if (!formState.name.trim()) {
      errors.name = "Название обязательно";
      isValid = false;
    }
    
    if (!formState.description.trim()) {
      errors.description = "Описание обязательно";
      isValid = false;
    } else if (formState.description.length < 20) {
      errors.description = "Описание должно быть не менее 20 символов";
      isValid = false;
    }
    
    if (formState.selectedTags.length === 0) {
      errors.tags = "Выберите хотя бы один тег стека технологий";
      isValid = false;
    }
    
    dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
    return isValid;
  }, [formState.name, formState.description, formState.selectedTags]);
  
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value });
    if (formState.formErrors.name) {
      dispatch({ type: 'CLEAR_ERROR', field: 'name' });
    }
  }, [formState.formErrors.name]);
  
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value });
    if (formState.formErrors.description) {
      dispatch({ type: 'CLEAR_ERROR', field: 'description' });
    }
  }, [formState.formErrors.description]);
  
  const handleTagsChange = useCallback((newTags: Tag[]) => {
    dispatch({ type: 'SET_TAGS', payload: newTags });
    if (formState.formErrors.tags) {
      dispatch({ type: 'CLEAR_ERROR', field: 'tags' });
    }
  }, [formState.formErrors.tags]);
  
  const handleImagesChange = useCallback((newImages: { id: string; url: string }[]) => {
    dispatch({ type: 'SET_IMAGES', payload: newImages });
  }, []);
  
  const handleCloseToast = useCallback(() => {
    dispatch({ type: 'SET_SUCCESS_TOAST', payload: false });
  }, []);
  
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_ERROR', payload: "" });
    
    if (!validateForm()) {
      return;
    }
    
    startTransition(async () => {
      try {
        await createStartup(
          formState.name,
          formState.description,
          formState.selectedTags,
          formState.images
        );
        
        dispatch({ type: 'SET_SUCCESS_TOAST', payload: true });
        dispatch({ type: 'RESET_FORM' });
        
        // Navigate after a brief delay to show the toast
        setTimeout(() => {
          router.push("/find");
          router.refresh();
        }, 1500);
      } catch (error) {
        console.error("Ошибка при создании стартапа:", error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: "Не удалось создать стартап. Пожалуйста, попробуйте снова." 
        });
      }
    });
  }, [validateForm, formState.name, formState.description, formState.selectedTags, formState.images, router]);
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Toast 
        visible={formState.showSuccessToast} 
        onClose={handleCloseToast}
        variant="success"
      >
        <div className="flex items-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium">Успех!</h3>
            <p className="text-sm">Стартап успешно создан.</p>
          </div>
        </div>
      </Toast>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Название стартапа" error={formState.formErrors.name}>
          <Input
            id="name"
            value={formState.name}
            onChange={handleNameChange}
            placeholder="Введите название вашего стартапа"
            disabled={isPending}
            className={formState.formErrors.name ? "border-red-500" : ""}
          />
        </FormField>
        
        <FormField label="Описание" error={formState.formErrors.description}>
          <Textarea
            id="description"
            value={formState.description}
            onChange={handleDescriptionChange}
            placeholder="Опишите свою идею стартапа подробно..."
            className={`min-h-[150px] ${formState.formErrors.description ? "border-red-500" : ""}`}
            disabled={isPending}
          />
          {!formState.formErrors.description && (
            <p className="text-sm text-muted-foreground mt-1">
              Вы можете добавить свои контакты для связи
            </p>
          )}
        </FormField>
        
        <FormField label="Теги" error={formState.formErrors.tags}>
          <TagInput
            existingTags={tags}
            selectedTags={formState.selectedTags}
            onChange={handleTagsChange}
            disabled={isPending}
            className={formState.formErrors.tags ? "border-red-500" : ""}
            placeholder="Введите теги..."
          />
          {!formState.formErrors.tags && (
            <p className="text-sm text-muted-foreground mt-1">
              Добавьте теги технологий которые вы используете, чтобы помочь другим пользователям найти вас
            </p>
          )}
        </FormField>

        <div className="space-y-1">
          <Label>Изображения</Label>
          <ImageUpload
            value={formState.images}
            onChange={handleImagesChange}
            disabled={isPending}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Добавьте изображения, чтобы показать макеты или идеи (необязательно)
          </p>
        </div>
        
        {formState.error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-500">{formState.error}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            disabled={isPending}
            className={`relative ${isPending ? "pl-9" : ""}`}
          >
            {isPending && (
              <span className="absolute left-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
            {isPending ? "Создание..." : "Создать стартап"}
          </Button>
          <Button 
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}