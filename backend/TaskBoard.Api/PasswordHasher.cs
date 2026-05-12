using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace TaskBoard.Api
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int Iterations = 100_000;
        private const string Prefix = "PBKDF2-SHA256-100000";

        public static string Hash(string password)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));

            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var subkey = KeyDerivation.Pbkdf2(
                password,
                salt,
                KeyDerivationPrf.HMACSHA256,
                Iterations,
                KeySize);

            return $"{Prefix}:{Convert.ToBase64String(salt)}:{Convert.ToBase64String(subkey)}";
        }

        public static bool Verify(string password, string? storedHash)
        {
            if (string.IsNullOrEmpty(storedHash) || password == null) return false;

            if (storedHash.StartsWith(Prefix + ":", StringComparison.Ordinal))
            {
                var parts = storedHash.Split(':', 3);
                if (parts.Length != 3) return false;

                var salt = Convert.FromBase64String(parts[1]);
                var expected = Convert.FromBase64String(parts[2]);
                var actual = KeyDerivation.Pbkdf2(
                    password,
                    salt,
                    KeyDerivationPrf.HMACSHA256,
                    Iterations,
                    expected.Length);

                return CryptographicOperations.FixedTimeEquals(actual, expected);
            }

            return VerifyLegacySha256(password, storedHash);
        }

        private static bool VerifyLegacySha256(string password, string storedHash)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes) == storedHash;
        }
    }
}
