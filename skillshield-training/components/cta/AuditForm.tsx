'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const formSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  message: z.string().min(10, 'Veuillez décrire votre frustration (minimum 10 caractères)'),
});

type FormData = z.infer<typeof formSchema>;

export default function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/audit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Merci ! On vous contacte sous 24h
        </h3>
        <p className="text-slate-organic-400">
          Vérifiez votre email, nous vous avons envoyé les détails de votre audit gratuit.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 md:space-y-8"
    >
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <Input
            {...register('firstName')}
            placeholder="Prénom *"
            error={!!errors.firstName}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="mt-2 text-sm text-pink-empathy-400">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register('lastName')}
            placeholder="Nom *"
            error={!!errors.lastName}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="mt-2 text-sm text-pink-empathy-400">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email *"
          error={!!errors.email}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-pink-empathy-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Input
          {...register('phone')}
          type="tel"
          placeholder="Téléphone (optionnel)"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Input
          {...register('company')}
          placeholder="Entreprise / Secteur *"
          error={!!errors.company}
          disabled={isSubmitting}
        />
        {errors.company && (
          <p className="mt-2 text-sm text-pink-empathy-400">
            {errors.company.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Quelle est votre plus grande frustration quotidienne ? *"
          rows={4}
          className={`w-full bg-white/10 border-2 rounded-xl px-5 py-4 text-lg text-white placeholder:text-slate-organic-500 focus:outline-none focus:ring-2 focus:ring-cyan-vivid-400 focus:border-transparent transition-all duration-300 ${
            errors.message
              ? 'border-pink-empathy-500 focus:ring-pink-empathy-500'
              : 'border-violet-soft-400/30'
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-2 text-sm text-pink-empathy-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full mt-8 md:mt-10"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Envoi en cours...
          </>
        ) : (
          'Réserver mon audit gratuit 📅'
        )}
      </Button>

      <div className="text-center space-y-2 md:space-y-3 text-sm md:text-base text-slate-organic-400 mt-6 md:mt-8">
        <p className="flex items-center justify-center gap-2">
          <span>✓</span> Appel de 30min sans engagement
        </p>
        <p className="flex items-center justify-center gap-2">
          <span>✓</span> Rapport d'opportunités personnalisé
        </p>
        <p className="flex items-center justify-center gap-2">
          <span>✓</span> 100% confidentiel
        </p>
      </div>
    </motion.form>
  );
}

