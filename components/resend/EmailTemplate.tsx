import * as React from 'react';

interface EmailTemplateProps {
  magicLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  magicLink,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  }}>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <h1 style={{ color: '#4F46E5', fontSize: '24px', marginBottom: '10px' }}>Войти в Startup Coders</h1>
      <p style={{ color: '#4B5563', fontSize: '16px', margin: '10px 0 20px' }}>
        Нажмите на кнопку ниже, чтобы войти в ваш аккаунт
      </p>
    </div>

    <div style={{ textAlign: 'center', margin: '30px 0' }}>
      <a
        href={magicLink}
        style={{
          backgroundColor: '#4F46E5',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '5px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'inline-block',
        }}
      >
        Войти в аккаунт
      </a>
    </div>

    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#6B7280' }}>
      <p>Если вы не запрашивали вход, вы можете проигнорировать это письмо.</p>
      <p style={{ marginTop: '15px', fontSize: '12px' }}>
        Срок действия ссылки истекает через 5 минут.
      </p>
    </div>
    
    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#9CA3AF' }}>
      <p>© {new Date().getFullYear()} Startup Coders. Все права защищены.</p>
    </div>
  </div>
);