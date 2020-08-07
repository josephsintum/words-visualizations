import { H1 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { VictoryBar, VictoryChart } from 'victory'
import { InferGetStaticPropsType } from 'next'
import { NewsType } from '../models/news.model'
import { H3 } from 'baseui/typography'
import React from 'react'

export const getStaticProps = async () => {
    const res = await fetch('http://localhost:3000/api/news')
    const news: NewsType[] = await res.json()

    return { props: { news } }
}

export default ({ news }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Block>
            <H1 color={'accent'}>Word Vis: Charting test</H1>
            <Block width={'70%'}>
                {news.map((data) => (
                    <>
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
                                {...console.log(data.stats.slice(25, 1))}
                                data={data.stats.slice(-25)}
                                x="word"
                                y="frequency"
                                labels={({ datum }) => `${datum.frequency}`}
                            />
                        </VictoryChart>
                        <br />
                    </>
                ))}
            </Block>
        </Block>
    )
}
