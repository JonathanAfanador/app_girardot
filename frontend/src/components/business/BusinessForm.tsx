import { useForm } from 'react-hook-form';
import type { BusinessFormData } from '../../types/business';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface BusinessFormProps {
  initialData?: BusinessFormData;
  onSubmit: (data: BusinessFormData) => void;
}

const BusinessForm = ({ initialData, onSubmit }: BusinessFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<BusinessFormData>({ defaultValues: initialData });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Input
        label="Nombre del negocio"
        {...register('nombre', { required: 'Este campo es obligatorio' })}
        error={errors.nombre?.message}
      />

      <Input
        label="Dirección"
        {...register('direccion', { required: 'Este campo es obligatorio' })}
        error={errors.direccion?.message}
      />

      <Input
        label="Teléfono"
        type="tel"
        {...register('telefono', { 
          required: 'Este campo es obligatorio',
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Teléfono inválido (10 dígitos)'
          }
        })}
        error={errors.telefono?.message}
      />

      <Input
        label="Descripción"
        as="textarea"
        rows={4}
        {...register('descripcion')}
      />

      <div className="mt-8">
        <Button type="submit" variant="primary">Guardar Cambios</Button>
      </div>
    </form>
  );
};

export default BusinessForm;