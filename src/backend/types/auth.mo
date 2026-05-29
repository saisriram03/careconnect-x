module {

  /// Stored authentication record.
  public type AuthRecord = {
    email        : Text;
    passwordHash : Text;
  };

  public type RegisterResult = {
    #ok;
    #alreadyExists;
  };

  public type VerifyResult = {
    #ok;
    #wrongPassword;
    #notFound;
  };

};
