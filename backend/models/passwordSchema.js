import PasswordValidator from 'password-validator';

// Create a schema
const schema = new PasswordValidator();

schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces()                           // Should not have spaces
  .has().symbols()                                // Must have at least one symbol

export default schema;
