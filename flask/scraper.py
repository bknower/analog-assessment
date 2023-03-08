import requests
from bs4 import BeautifulSoup

# user = "c9s"
# TODO: get multiple pages at once by checking number of repos on first page
def get_repositories(user):

    page_number = 1

    results = []
    while True:
        url = f"https://github.com/{user}?page={page_number}&tab=repositories"
        page = requests.get(url)

        soup = BeautifulSoup(page.content, "html.parser")
        result = soup.find_all(itemprop="name codeRepository")
        if len(result) == 0:
            break
        results.extend(result)
        page_number += 1
    

    return [r.text.lstrip() for r in results]
