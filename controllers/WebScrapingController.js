const puppeteer = require('puppeteer')
require('dotenv').config()

module.exports = {
  getOfficialLadder: async (req,res) => {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ],
      executablePath: process.env.NODE_ENV === 'production'
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath()
    })

    try {
        const page = await browser.newPage()
        const URL = 'https://www.nrl.com/ladder/?competition=111&season=2023'
        await page.goto(URL, {
          waitUntil: 'load',
          timeout: 0
        })

        const tableData = []
        const rows = await page.$$('#ladder-table tbody tr')
        const round = await page.$eval('.filter-round__button span', el => el.textContent)

        for (const row of rows) {
          const teamObj = {
            ladderPosition: await row.$eval('td:nth-of-type(1) .ladder-position', el => el.textContent),
            logo: await row.$eval('td:nth-of-type(2) img', el => el.src),
            teamName: await row.$eval('td:nth-of-type(4) a', el => el.textContent),
            gamesPlayed: await row.$eval('td:nth-of-type(5)', el => el.textContent),
            points: await row.$eval('td:nth-of-type(6)', el => el.textContent),
            wins: await row.$eval('td:nth-of-type(7)', el => el.textContent),
            draws: await row.$eval('td:nth-of-type(8)', el => el.textContent),
            losses: await row.$eval('td:nth-of-type(9)', el => el.textContent),
            byes: await row.$eval('td:nth-of-type(10)', el => el.textContent),
            pointsFor: await row.$eval('td:nth-of-type(11)', el => el.textContent),
            pointsAgainst: await row.$eval('td:nth-of-type(12)', el => el.textContent),
            pointsDiff: await row.$eval('td:nth-of-type(13)', el => el.textContent),
          }
          tableData.push(teamObj)
        }
        res.status(200).send({
          data: tableData,
          round,
        })
    } catch (e) {
        res.status(400).send({
          errorMessage: e.message
        })
    } finally {
      await browser.close()
    }
  }
}