# Déploiement sur GitHub Pages

## Configuration initiale (une seule fois)

### 1. Créer le repository GitHub

Si vous ne l'avez pas encore fait :
1. Allez sur [GitHub](https://github.com)
2. Créez un nouveau repository (ex: `moood`)
3. Ne cochez **PAS** "Initialize with README" si vous avez déjà un projet local

### 2. Connecter votre projet local au repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/moood.git
git push -u origin main
```

### 3. Configurer GitHub Pages dans GitHub

**Option A : Utilisation de GitHub Actions (Recommandé - Déploiement automatique)**

1. Allez dans les paramètres de votre repository : `Settings` → `Pages`
2. Sous **Source**, sélectionnez **GitHub Actions**
3. Le workflow `.github/workflows/deploy.yml` sera automatiquement utilisé
4. À chaque push sur la branche `main`, le déploiement se fera automatiquement

**Option B : Utilisation de la branche gh-pages (Déploiement manuel)**

1. Allez dans les paramètres : `Settings` → `Pages`
2. Sous **Source**, sélectionnez **Deploy from a branch**
3. Choisissez la branche `gh-pages` et le dossier `/ (root)`
4. Cliquez sur **Save**

## Déploiement

### Méthode 1 : Commande unique (avec gh-pages)

```bash
npm install
npm run deploy
```

Cette commande va :
1. Builder votre application (`npm run build`)
2. Déployer le dossier `dist` sur la branche `gh-pages`

### Méthode 2 : Déploiement automatique avec GitHub Actions

Si vous avez configuré GitHub Actions (Option A ci-dessus) :
1. Poussez simplement votre code sur `main` :
   ```bash
   git add .
   git commit -m "Votre message"
   git push origin main
   ```
2. Le déploiement se fera automatiquement via GitHub Actions

## URL de votre site

Une fois déployé, votre site sera accessible à :
```
https://VOTRE_USERNAME.github.io/moood/
```

⚠️ **Important** : Assurez-vous que le `base` dans `vite.config.js` correspond au nom de votre repository (`/moood/` dans cet exemple).

## Mise à jour

Pour mettre à jour le site déployé :
- **Avec gh-pages** : `npm run deploy`
- **Avec GitHub Actions** : Push sur `main` (déploiement automatique)

## Dépannage

### Le site ne se charge pas
- Vérifiez que GitHub Pages est bien activé dans les paramètres
- Attendez quelques minutes (le déploiement peut prendre 1-2 minutes)
- Vérifiez que l'URL utilise le bon chemin (`/moood/` si c'est le nom du repo)

### Les assets ne se chargent pas
- Vérifiez que le `base` dans `vite.config.js` correspond au nom du repository
- Re-buildez et redéployez après avoir modifié `vite.config.js`

### Erreur de permissions
- Vérifiez que vous avez les droits d'écriture sur le repository
- Vérifiez que GitHub Pages a les permissions nécessaires dans Settings → Pages → Workflow permissions
