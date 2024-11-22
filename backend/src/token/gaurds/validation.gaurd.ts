import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TextValidationGuard implements CanActivate {
  private validateText(text: string): { valid: boolean; error?: string } {
    if (text.length > 2000) {
      return {
        valid: false,
        error: 'Text exceeds maximum length of 2000 characters.',
      };
    }
    const specialCharRegex = /[^\p{L}\p{N}\s]/u; // Check for special characters
    const containsAlphaOrNumberRegex = /[\p{L}\p{N}]/u;
    if (containsAlphaOrNumberRegex.test(text)) {
      return { valid: true };
    } else if (specialCharRegex.test(text)) {
      return { valid: false, error: 'Text contains special characters.' };
    } else {
      return { valid: false };
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { text } = request.body;

    const validation = this.validateText(text);

    if (!validation.valid) {
      throw new ForbiddenException(validation.error || 'Invalid text input.');
    }

    return true;
  }
}
