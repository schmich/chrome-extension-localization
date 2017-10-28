# Chrome Extension Localization

## Overview

View [live demo](https://schmich.github.io/marinara-localization).

Describe workflow: push to extension repo, travis builds the state.json, pushes to extension localization repo, users can access your localization page and do localization

Give high-level overview (2 repos, Travis, auto-deploy, frontend)

Chart/diagram explaining flow

## Walkthrough

This tool was created to help localize [Marinara](https://github.com/schmich/marinara). The following walkthrough will use `marinara` as the example project name.

1. Create a new GitHub repo called `marinara-localization`:

(screenshots)

2. Clone `marinara-localization`:

```
git clone git@github.com:you/marinara-localization
```

3. Link the repo with `chrome-extension-localization`:

```
/src/marinara-localization$ git submodule add https://github.com/schmich/chrome-extension-localization
```

4. Link to `index.html` for GitHub Pages:

```
/src/marinara-localization$ ln -s chrome-extension-localization/web/index.html .
```

5. Commit and push your changes:

```
/src/marinara-localization$ git commit -am 'Initial commit.' && git push
```

6. Enable GitHub Pages on the master branch for `marinara-localization` at https://github.com/you/marinara-localization/settings:

(screenshots)

7. In your `marinara` source, create a folder called `deploy`:

```
/src/marinara$ mkdir deploy && cd deploy
```

8. Link the repo with `chrome-extension-localization`:

```
/src/marinara/deploy$ git submodule add https://github.com/schmich/chrome-extension-localization
```

9. Create a deployment key for deploying from Travis CI to `marinara-localization`:

```
/src/marinara/deploy$ ssh-keygen -t rsa -b 4096 -C "you@example.com" -f deploy_key
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in deploy_key.
Your public key has been saved in deploy_key.pub.
The key fingerprint is:
SHA256:nY5jLr0JFgOZfBp1N/hLPiPj7jIT9K4vGYwT/PubevI you@example.com
...
```

10. Add `deploy_key` to your `.gitignore`:

```
/src/marinara/deploy$ echo deploy_key >> ../.gitignore
```

11. Add `deploy_key.pub` as a deployment key for `marinara-localization` at https://github.com/you/marinara-localization/settings/keys:

(screenshots)

12. Enable Travis builds for `marinara` at https://travis-ci.org/you/marinara:

(screenshots)

12. Copy the Travis configuration into `marinara`:

```
/src/marinara/deploy$ (cd .. && curl -LO "https://raw.githubusercontent.com/schmich/chrome-extension-localization/master/deploy/.travis.yml")
```

13. Update `.travis.yml` and change `COMMIT_AUTHOR_NAME`, `COMMIT_AUTHOR_EMAIL`, and `LOCALES_PATH`; `LOCALES_PATH` is the
relative path from your repo root to your `_locales` folder where your translations are stored

14. Encrypt the deployment key with Travis:

```
/src/marinara/deploy$ gem install travis
Fetching: travis-1.8.8.gem (100%)
Successfully installed travis-1.8.8
Parsing documentation for travis-1.8.8
Installing ri documentation for travis-1.8.8
Done installing documentation for travis after 2 seconds
1 gem installed
```

```
/src/marinara/deploy$ travis encrypt-file deploy_key --add
encrypting deploy_key for you/marinara
storing result as deploy_key.enc
storing secure env variables for decryption

Make sure to add deploy_key.enc to the git repository.
Make sure not to add deploy_key to the git repository.
Commit all changes to your .travis.yml.
```

15. Add the deployment files to `marinara`:

```
/src/marinara/deploy$ git add chrome-extension-localizatoin deploy_key.{enc,pub} ../.{travis.yml,gitignore}
```

16. Commit and push the new files; ensure `deploy_key` is not committed:

```
/src/marinara/deploy$ git commit && git push
```

17. Wait for your Travis build to complete at https://travis-ci.org/you/marinara

(Travis clones, builds, tests, and pushes your translation changes)

18. Check your translations at https://you.github.io/marinara-localization

## Updating

TODO `git submodule update --remote chrome-extension-localization`

