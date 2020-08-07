import { H1 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip } from 'victory'
import { InferGetStaticPropsType } from 'next'
import { NewsType } from '../models/news.model'

export const getStaticProps = async () => {
    const res = await fetch('https://words-stats.vercel.app/api/news')
    const news: NewsType[] = await res.json()

    return { props: { news } }
}

export default ({ news }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Block>
            <H1>Word Vis: Charting test</H1>
            <Block width={'50%'}>
                <VictoryChart
                    horizontal
                    domainPadding={20}
                    height={500}
                    padding={{ left:80 }}
                    theme={VictoryTheme.material}
                >
                    <VictoryBar
                        data={news[0].stats.slice(0, 20)}
                        x="word"
                        y="frequency"
                        labels={({ datum }) =>
                            `${datum.word}: ${datum.frequency}`
                        }
                        style={{ labels: { fontSize: 10 } }}
                        labelComponent={
                            <VictoryTooltip
                                cornerRadius={0}
                                flyoutStyle={{ fill: 'white' }}
                            />
                        }
                    />
                </VictoryChart>
            </Block>
        </Block>
    )
}
