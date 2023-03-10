import requests
from bs4 import BeautifulSoup

def get_repositories(user):
    page_number = 1
    results = []

    # repeat until we run out of pages of responses
    while True:
        url = f"https://github.com/{user}?page={page_number}&tab=repositories"
        page = requests.get(url)
        if page.status_code != 200:
            raise Exception("User does not exist")

        soup = BeautifulSoup(page.content, "html.parser")


        # the outer html around each repo the user owns
        repos = soup.find_all(itemprop="owns")

        # if none were found then we've gotten all pages
        if len(repos) == 0:
            break

        for repo in repos:
            name = repo.find(itemprop="name codeRepository").text.strip()
            link = f"https://github.com/{user}/{name}"
            description = repo.find(itemprop="description")
            pl = repo.find(itemprop="programmingLanguage")

            description = description and description.text or ""
            pl = pl and pl.text or ""
            
            result = {
                "name": name,
                "link": link,
                "description": description,
                "pl": pl
            }
            result = {k : v.strip() for (k, v) in result.items()}

            results.append(result)
        page_number += 1
    

    return results
