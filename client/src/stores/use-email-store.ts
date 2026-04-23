import type { EmailTemplate } from '@/domains/email-templates/email-template.types'
import { create } from 'zustand'


type EmailStore = {
  emailData: EmailTemplate | null
  updateEmailField: (payload: Partial<EmailTemplate>) => void
  resetEmailData: () => void
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emailData: null,
  updateEmailField: (payload) => {
    const updated = {
      ...get().emailData,
      ...payload,
    };
    set({ emailData: updated as EmailTemplate });
  },
  resetEmailData: () => {
    set({ emailData: null });
  },
}))