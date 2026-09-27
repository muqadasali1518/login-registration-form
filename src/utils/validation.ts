import { FormErrors, LoginFormData, PasswordStrength, RegisterFormData } from '../types/auth';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. user@domain.com)' };
  }
  return { isValid: true };
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  const requirements = {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };

  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-slate-300 dark:bg-slate-700',
      percentage: 0,
      requirements,
    };
  }

  // Calculate points
  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (hasUpper && hasLower) points++;
  if (hasNumber) points++;
  if (hasSpecial) points++;

  // Score mapping (0-4)
  let score = 0;
  let label: PasswordStrength['label'] = 'Very Weak';
  let color = 'bg-rose-500';
  let percentage = 20;

  if (points >= 5) {
    score = 4;
    label = 'Very Strong';
    color = 'bg-emerald-500';
    percentage = 100;
  } else if (points >= 4) {
    score = 3;
    label = 'Strong';
    color = 'bg-teal-500';
    percentage = 80;
  } else if (points >= 3) {
    score = 2;
    label = 'Fair';
    color = 'bg-amber-500';
    percentage = 55;
  } else if (points >= 2) {
    score = 1;
    label = 'Weak';
    color = 'bg-orange-500';
    percentage = 35;
  } else {
    score = 0;
    label = 'Very Weak';
    color = 'bg-rose-500';
    percentage = 15;
  }

  return {
    score,
    label,
    color,
    percentage,
    requirements,
  };
}

export function validateLoginForm(data: LoginFormData): FormErrors {
  const errors: FormErrors = {};

  const emailCheck = validateEmail(data.email);
  if (!emailCheck.isValid) {
    errors.email = emailCheck.error;
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

export function validateRegisterForm(data: RegisterFormData): FormErrors {
  const errors: FormErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Full name is required';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    errors.name = 'Name should only contain letters, spaces, or hyphens';
  }

  const emailCheck = validateEmail(data.email);
  if (!emailCheck.isValid) {
    errors.email = emailCheck.error;
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const strength = evaluatePasswordStrength(data.password);
    if (!strength.requirements.minLength) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!strength.requirements.hasUpper || !strength.requirements.hasLower) {
      errors.password = 'Password must include both uppercase and lowercase letters';
    } else if (!strength.requirements.hasNumber) {
      errors.password = 'Password must include at least one number';
    }
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirmation password is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must accept the Terms of Service to continue';
  }

  return errors;
}
