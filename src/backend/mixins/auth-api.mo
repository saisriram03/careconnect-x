import Map  "mo:core/Map";
import Auth "../types/auth";

mixin (users : Map.Map<Text, Auth.AuthRecord>) {

  /// Register a new user with a pre-hashed password.
  /// Returns #alreadyExists if the email is already registered.
  public func registerUser(email : Text, passwordHash : Text) : async Auth.RegisterResult {
    switch (users.get(email)) {
      case (?_) { #alreadyExists };
      case null {
        users.add(email, { email; passwordHash });
        #ok;
      };
    };
  };

  /// Verify a login attempt.
  /// Returns #ok, #wrongPassword, or #notFound.
  public query func verifyPassword(email : Text, passwordHash : Text) : async Auth.VerifyResult {
    switch (users.get(email)) {
      case null { #notFound };
      case (?record) {
        if (record.passwordHash == passwordHash) { #ok }
        else { #wrongPassword };
      };
    };
  };

};
