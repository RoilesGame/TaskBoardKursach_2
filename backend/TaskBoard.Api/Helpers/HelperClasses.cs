using System;

namespace TaskBoard.Api.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime GetUtcNow() => DateTime.UtcNow;

        public static string FormatForDisplay(DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        }

        public static bool IsOverdue(DateTime? dueDate)
        {
            return dueDate.HasValue && dueDate.Value < DateTime.Today;
        }

        public static int DaysUntilDue(DateTime? dueDate)
        {
            if (!dueDate.HasValue) return -1;
            return (int)(dueDate.Value.Date - DateTime.Today).TotalDays;
        }

        /// <summary>
        /// Npgsql maps <c>timestamptz</c> to UTC-only <see cref="DateTime"/>; JSON often yields <see cref="DateTimeKind.Unspecified"/>.
        /// </summary>
        public static DateTime? ToUtcForPostgreSql(DateTime? value)
        {
            if (!value.HasValue) return null;
            var d = value.Value;
            return d.Kind switch
            {
                DateTimeKind.Utc => d,
                DateTimeKind.Local => d.ToUniversalTime(),
                _ => DateTime.SpecifyKind(d.Date, DateTimeKind.Utc)
            };
        }
    }

    public static class GuidHelper
    {
        public static bool IsValidGuid(string guidString)
        {
            return Guid.TryParse(guidString, out _);
        }

        public static Guid GenerateId()
        {
            return Guid.NewGuid();
        }
    }

    public static class StringHelper
    {
        public static string Truncate(string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength) + "...";
        }

        public static string Capitalize(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return char.ToUpper(value[0]) + value.Substring(1);
        }
    }
}
