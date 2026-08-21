import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { weddingConfig } from '../../config/wedding.config'
import { saveResponse } from '../../lib/rsvp-storage'
import type { CustomQuestion, RSVPValues } from '../../types/wedding'

const schema = z.object({
  attendance: z.enum(['yes', 'no'], { message: 'Choisissez une réponse.' }),
  firstName: z.string().trim().min(2, 'Indiquez votre prénom.'),
  lastName: z.string().trim().min(2, 'Indiquez votre nom.'),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Adresse email invalide.').or(z.literal('')).optional(),
  accompanied: z.enum(['yes', 'no']),
  companionName: z.string().trim().optional(),
  guests: z.number().min(1).max(weddingConfig.rsvp.maxGuests),
  dietaryRestrictions: z.string().trim().max(300).optional(),
  message: z.string().trim().max(800, 'Votre message est un peu trop long.').optional(),
  transport: z.string().optional(),
  customAnswers: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.number(), z.boolean(), z.null(), z.undefined()])).optional(),
}).superRefine((values, context) => {
  if (values.attendance === 'yes' && values.accompanied === 'yes' && !values.companionName) {
    context.addIssue({ code: 'custom', path: ['companionName'], message: 'Indiquez le nom de votre accompagnant·e.' })
  }
})

const emptyValues: RSVPValues = {
  attendance: 'yes', firstName: '', lastName: '', phone: '', email: '', accompanied: 'no', companionName: '', guests: 1, dietaryRestrictions: '', message: '', transport: '', customAnswers: {},
}
function CustomQuestionField({ question, register }: { question: CustomQuestion; register: ReturnType<typeof useForm<RSVPValues>>['register'] }) {
  const fieldName = `customAnswers.${question.id}` as const
  if (question.type === 'textarea') {
    return <div className="rsvp-step"><label>{question.label}<textarea rows={3} {...register(fieldName)} /></label></div>
  }
  if (question.type === 'select') {
    return <div className="rsvp-step"><label>{question.label}<select {...register(fieldName)}><option value="">Choisir</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select></label></div>
  }
  if (question.type === 'radio' || question.type === 'checkbox') {
    return (
      <fieldset className="rsvp-step">
        <legend>{question.label}</legend>
        <div className="choice-pair">{question.options?.map((option) => <label className={`choice-line ${question.type === 'checkbox' ? 'choice-line--checkbox' : ''}`} key={option}><input type={question.type} value={option} {...register(fieldName)} /><span>{option}</span></label>)}</div>
      </fieldset>
    )
  }
  return <div className="rsvp-step"><label>{question.label}<input type={question.type === 'phone' ? 'tel' : question.type} {...register(fieldName, { valueAsNumber: question.type === 'number' })} /></label></div>
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

type RSVPProps = {
  invitationToken?: string
  invalidInvitation: boolean
  open: boolean
  onClose: () => void
}

export function RSVP({ invitationToken, invalidInvitation, open, onClose }: RSVPProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const token = invitationToken ?? 'open-invitation'
  const [mode, setMode] = useState<'editing' | 'alreadySubmitted'>('editing')
  const [serverError, setServerError] = useState('')
  const [savedFirstName, setSavedFirstName] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RSVPValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  })
  const attendance = watch('attendance')
  const accompanied = watch('accompanied')

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    document.body.classList.add('rsvp-open')
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('rsvp-open')
      previousFocus?.focus()
    }
  }, [onClose, open])

  if (!weddingConfig.rsvp.enabled) return null
  if (!open) return null

  const renderDialog = (content: ReactNode, className = '', labelledBy = 'rsvp-title') => (
    <div className="rsvp-modal">
      <button className="rsvp-modal__backdrop" type="button" aria-label="Fermer la confirmation d’invitation" onClick={onClose} />
      <section
        ref={dialogRef}
        className={`rsvp rsvp-modal__dialog ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button ref={closeButtonRef} className="rsvp-modal__close" type="button" onClick={onClose}>
          Fermer <span aria-hidden="true">×</span>
        </button>
        {content}
      </section>
    </div>
  )

  if (invalidInvitation) {
    return renderDialog(<><p className="rsvp__monogram">{weddingConfig.couple.monogram}</p><h2 id="rsvp-invalid-title">Invitation introuvable</h2><p>Ce lien d’invitation ne semble pas valide. Contactez-nous pour recevoir le bon lien.</p></>, 'rsvp--message', 'rsvp-invalid-title')
  }

  const submit = async (values: RSVPValues) => {
    setServerError('')
    try {
      await saveResponse(values, token)
      setSavedFirstName(values.firstName)
      setMode('alreadySubmitted')
    } catch {
      setServerError("Nous n'avons pas pu enregistrer votre réponse. Vos informations sont toujours présentes. Veuillez réessayer.")
    }
  }

  const invalid = () => {
    setServerError('Veuillez compléter ou vérifier les champs indiqués avant d’envoyer votre réponse.')
  }

  if (mode === 'alreadySubmitted') {
    return renderDialog(
      <>
        <p className="rsvp__monogram">{weddingConfig.couple.monogram}</p>
        <h2 id="rsvp-saved-title">Votre réponse est déjà enregistrée.</h2>
        <p>Merci{savedFirstName ? `, ${savedFirstName}` : ''}. Nous avons bien reçu votre confirmation.</p>
        <button className="button button--ink" type="button" onClick={onClose}>Fermer</button>
      </>,
      'rsvp--message',
      'rsvp-saved-title',
    )
  }

  return renderDialog(
    <>
      <header className="rsvp__header">
        <span>Confirmation d’invitation</span>
        <h2 id="rsvp-title">Votre<br />réponse</h2>
        <p>Votre présence rendra cette journée encore plus précieuse.<br />Dites-nous simplement si vous pourrez être parmi nous.</p>
      </header>
      <form className="rsvp-form" onSubmit={handleSubmit(submit, invalid)} noValidate>
        <fieldset className="rsvp-step">
          <legend>Serez-vous parmi nous ?</legend>
          <label className="choice-line"><input type="radio" value="yes" {...register('attendance')} /><span>Oui, avec grand plaisir.</span></label>
          <label className="choice-line"><input type="radio" value="no" {...register('attendance')} /><span>Malheureusement, je ne pourrai pas être présent·e.</span></label>
          {errors.attendance ? <p className="field-error">{errors.attendance.message}</p> : null}
        </fieldset>

        <div className="rsvp-step rsvp-step--grid">
          <label>Prénom<input autoComplete="given-name" {...register('firstName')} /><span>{errors.firstName?.message}</span></label>
          <label>Nom<input autoComplete="family-name" {...register('lastName')} /><span>{errors.lastName?.message}</span></label>
          {weddingConfig.rsvp.fields.phone ? <label>Téléphone<input type="tel" autoComplete="tel" {...register('phone')} /><span>{errors.phone?.message}</span></label> : null}
          {weddingConfig.rsvp.fields.email ? <label>Email<input type="email" autoComplete="email" {...register('email')} /><span>{errors.email?.message}</span></label> : null}
        </div>

        {attendance === 'yes' ? (
          <div className="rsvp-conditional">
            <fieldset className="rsvp-step">
              <legend>Viendrez-vous accompagné·e ?</legend>
              <div className="choice-pair">
                <label className="choice-line"><input type="radio" value="yes" {...register('accompanied')} /><span>Oui</span></label>
                <label className="choice-line"><input type="radio" value="no" {...register('accompanied')} /><span>Non</span></label>
              </div>
            </fieldset>
            {accompanied === 'yes' ? <div className="rsvp-step"><label>Nom de votre accompagnant·e<input {...register('companionName')} /><span>{errors.companionName?.message}</span></label><input type="hidden" value="2" {...register('guests', { setValueAs: Number })} /></div> : <input type="hidden" value="1" {...register('guests', { setValueAs: Number })} />}
            {weddingConfig.rsvp.fields.dietaryRestrictions ? <div className="rsvp-step"><label>Préférences ou restrictions alimentaires<textarea rows={2} {...register('dietaryRestrictions')} /><span>{errors.dietaryRestrictions?.message}</span></label></div> : null}
            {weddingConfig.rsvp.customQuestions.map((question) => <CustomQuestionField key={question.id} question={question} register={register} />)}
          </div>
        ) : <input type="hidden" value="1" {...register('guests', { setValueAs: Number })} />}

        {weddingConfig.rsvp.fields.message ? <div className="rsvp-step"><label>Un petit mot pour nous ?<textarea rows={3} maxLength={800} {...register('message')} /><span>{errors.message?.message}</span></label></div> : null}
        {serverError ? <p className="form-error" role="alert">{serverError}</p> : null}
        <button className="button button--ink button--submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement…' : 'Envoyer ma réponse'}</button>
      </form>
    </>,
  )
}
