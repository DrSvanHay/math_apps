#! /bin/zsh

# Setze die Variablen
#LOCAL_DIR="/pfad/zum/lokalen/verzeichnis" # Pfad zu deinem lokalen Verzeichnis
REMOTE_URL="https://github.com/DrSvanHay/math_apps.git" # GitHub-URL des Repos

# In das lokale Verzeichnis wechseln
#cd "$LOCAL_DIR" || exit

# Verzeichnis als Git-Repository initialisieren, falls nicht vorhanden
if [ ! -d ".git" ]; then
  git init
fi

# Dateien hinzufügen und committen
git add .
git commit -m "Initial commit"

REMOTE_URL=https://DrSvanHay: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@github.com/DrSvanHay/math_apps.git
# Remote-URL setzen (entfernt vorherige Remote-URLs, falls vorhanden)
git remote remove origin 2>/dev/null
git remote add origin "$REMOTE_URL"

# Änderungen pushen
git push -u origin main
