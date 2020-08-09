import { H1 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { VictoryBar, VictoryChart } from 'victory'
import { InferGetStaticPropsType } from 'next'
import { NewsType } from '../models/news.model'

export const getStaticProps = async () => {
    const res = await fetch(`${process.env.API_URL}/news`)
    const news: NewsType[] = await res.json()

    return { props: { news } }
}

export default ({ news }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Block>
            <H1 color={'accent'}>Word Vis: Charting test</H1>
            <Block width={'70%'}>
                {news.map((data) => (
                    <Block key={`stat${data.dateTime.valueOf()}`}>
                        <H3>{new Date(data.dateTime).toLocaleString()}</H3>
                        <br />
                        <VictoryChart
                            horizontal
                            domainPadding={25}
                            height={400}
                            padding={{ left: 80 }}
                            // animate={{
                            //     onLoad: {
                            //         duration: 500,
                            //     },
                            // }}
                        >
                            <VictoryBar
                                data={data.stats.slice(-25)}
                                x="word"
                                y="frequency"
                                labels={({ datum }) => `${datum.frequency}`}
                            />
                        </VictoryChart>
                        <br />
                    </Block>
                ))}
            </Block>
        </Block>
    )
}
