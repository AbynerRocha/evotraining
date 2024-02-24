export function hideEmail(email: string) {
    const [name, domain] = email.split('@');
     const length = name.length;
     const maskedName = name.substring(0, Math.ceil(length/2)-2) + '****' + name[length - 1];
  
     const maskedEmail = maskedName + '@' + domain;
     return maskedEmail;
  }