FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ["TaskBoard.Api/TaskBoard.Api.csproj", "TaskBoard.Api/"]
COPY ["TaskBoard.Data/TaskBoard.Data.csproj", "TaskBoard.Data/"]
COPY ["TaskBoard.Models/TaskBoard.Models.csproj", "TaskBoard.Models/"]

RUN dotnet restore "TaskBoard.Api/TaskBoard.Api.csproj"

COPY . .

WORKDIR "/src/TaskBoard.Api"
RUN dotnet build "TaskBoard.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TaskBoard.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "TaskBoard.Api.dll"]
