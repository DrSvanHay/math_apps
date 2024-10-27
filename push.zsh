#! /bin/zsh

rsync --progress --partial --recursive * root@giuseppe:/var/www/cluez.de/web/mathe/

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

# Remote-URL setzen (entfernt vorherige Remote-URLs, falls vorhanden)
git remote remove origin 2>/dev/null
git remote add origin "$REMOTE_URL"

# Änderungen pushen
git push -u origin main
