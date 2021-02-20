import * as React from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Box, Container, Typography } from '@material-ui/core'
import { DailyStatsModel, DailyStatsType } from '../models/dailyStats.model'

const Sentiment = ({
    dailyStats,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
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

export const getStaticProps: GetStaticProps = async () => {
    const data = await DailyStatsModel.find({})
    let dailyStats: DailyStatsType[] = JSON.parse(JSON.stringify(data))
    return { props: { dailyStats } }
}
