import * as React from 'react'
import { GetServerSideProps } from 'next'
import { Box, Container, Typography } from '@material-ui/core'
import { DailyStatsModel, DailyStatsType } from '../models/dailyStats.model'
import middleware from '../middleware/middleware'

const Sentiment = ({ dailyStats }: { dailyStats: DailyStatsType[] }) => (
    <Container>
        <Box paddingY="40px">
            <Typography variant="h4" gutterBottom>
                Freq x Time Graph
            </Typography>
            <Box>
                <Box style={{ height: 400, width: '100%' }}>
                    {dailyStats[0].stats.map(
                        (data: { word: string; frequency: number }) => (
                            <Typography key={'word_' + data.word}>
                                {data.word}, {data.frequency}
                            </Typography>
                        )
                    )}
                </Box>
            </Box>
        </Box>
    </Container>
)

export default Sentiment

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    // apply middleware(connect to db)
    await middleware.apply(req, res)

    const data = await DailyStatsModel.find({})
    let dailyStats: DailyStatsType[] = JSON.parse(JSON.stringify(data))
    return { props: { dailyStats } }
}

/*
 * Twit - Twitter JS Client
 * https://github.com/ttezel/twit
 *
 * */
