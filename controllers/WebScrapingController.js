const puppeteer = require('puppeteer')

module.exports = {
  getOfficialLadder: async(req,res) => {
    const browser = await puppeteer.launch({ headless: 'new' })

    try {
        const page = await browser.newPage()
        const URL = 'https://www.nrl.com/ladder/?competition=111&season=2023'
        await page.goto(URL)

        const tableData = []
        const rows = await page.$$('#ladder-table tbody tr')
        const round = await page.$eval('.filter-round__button span', el => el.textContent)

        for (const row of rows) {
            const ladderPosition = await row.$eval('td:nth-of-type(1) .ladder-position', el => el.textContent)
            const logo = await row.$eval('td:nth-of-type(2) img', el => el.src)
            const teamName = await row.$eval('td:nth-of-type(4) a', el => el.textContent)
            const gamesPlayed = await row.$eval('td:nth-of-type(5)', el => el.textContent)
            const points = await row.$eval('td:nth-of-type(6)', el => el.textContent)
            const wins = await row.$eval('td:nth-of-type(7)', el => el.textContent)
            const draws = await row.$eval('td:nth-of-type(8)', el => el.textContent)
            const losses = await row.$eval('td:nth-of-type(9)', el => el.textContent)
            const byes = await row.$eval('td:nth-of-type(10)', el => el.textContent)
            const pointsFor = await row.$eval('td:nth-of-type(11)', el => el.textContent)
            const pointsAgainst = await row.$eval('td:nth-of-type(12)', el => el.textContent)
            const pointsDiff = await row.$eval('td:nth-of-type(13)', el => el.textContent)

            const teamObj = {
                ladderPosition,
                logo,
                teamName,
                gamesPlayed,
                points,
                wins,
                draws,
                losses,
                byes,
                pointsFor,
                pointsAgainst,
                pointsDiff,
            }

            tableData.push(teamObj)
        }

        await browser.close()
        return res.status(200).send({
          data: tableData,
          round,
        })
    } catch (e) {
        await browser.close()
        res.status(400).send({
          errorMessage: e.message
        })
    }
  }
}