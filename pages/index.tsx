import React, { useEffect, useState } from 'react'
import { Display4, Label1, H1, H3, H4 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { SIZE, StyledSpinnerNext } from 'baseui/spinner'
import {
    VictoryAxis,
    VictoryBar,
    VictoryBrushContainer,
    VictoryChart,
    VictoryTheme,
} from 'victory'

import { NewsType } from '../models/news.model'

const calcWordFreq = (
    statistics: NewsType[],
    startTime: Date | number,
    endTime: Date | number
) => {
    let start = new Date(startTime)
    let end = new Date(endTime)

    return statistics
        .reduce((acc: NewsType['stats'][], stat) => {
            let currTime = new Date(stat.dateTime)
            if (start <= currTime && currTime <= end) acc.push(stat.stats)
            return acc
        }, [])
        .flat()
        .reduce((acc: NewsType['stats'], stat) => {
            let count = acc.find((k) => k.word === stat.word)
            if (count) {
                ++count.frequency
            } else {
                acc.push({ word: stat.word, frequency: 1 })
            }
            return acc
        }, [])
        .sort((a, b) => {
            return a.frequency - b.frequency
        })
}

export default () => {
    const [isLoaded, setIsLoaded] = useState<{
        isLoaded: boolean
        error: any
    }>({ isLoaded: false, error: null })
    const [news, setNews] = useState<NewsType[]>([])

    useEffect(() => {
        fetch('api/news')
            .then((res) => res.json())
            .then(
                (newsData: NewsType[]) => {
                    setIsLoaded({ ...isLoaded, isLoaded: true })
                    setNews(newsData)
                },
                (error) => {
                    setIsLoaded({ isLoaded: true, error: error })
                }
            )
    }, [])

    return (
        <Block>
            <H1 color={'accent'}>Word Vis: Charting test</H1>
            <Block width={'80%'}>
                <H3>Time X frequency chart</H3>
                <br />

                {isLoaded.error ? (
                    <Display4 color={'negative'}>{isLoaded.error}</Display4>
                ) : !isLoaded.isLoaded ? (
                    <StyledSpinnerNext $size={SIZE.large} />
                ) : (
                    <TestGraph news={news} />
                )}
            </Block>
        </Block>
    )
}

export const TestGraph = ({ news }: { news: NewsType[] }) => {
    const [selected, setSelected] = useState<{
        x?: [Date, Date] | [number, number]
    }>({ x: [new Date().setHours(6), new Date().setHours(12)] })
    return (
        <div>
            {selected.x ? (
                <Block>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={30}
                        horizontal
                        width={1000}
                    >
                        <VictoryBar
                            x="word"
                            y="frequency"
                            data={calcWordFreq(
                                news,
                                new Date(selected.x[0]),
                                new Date(selected.x[1])
                            ).slice(-10)}
                            labels={({ datum }) => `${datum.frequency}`}
                        />
                    </VictoryChart>
                </Block>
            ) : (
                'pending'
            )}
            <br />
            <H4 $style={{ textAlign: 'center' }}>
                <Label1>
                    {selected.x
                        ? new Date(selected.x[0]).toLocaleDateString()
                        : 'Date'}
                </Label1>
                {selected.x
                    ? new Date(selected.x[0]).toLocaleTimeString()
                    : 'Select'}
                {' - '}
                {selected.x
                    ? new Date(selected.x[1]).toLocaleTimeString()
                    : 'Time'}
            </H4>
            <br />
            <VictoryChart
                width={1000}
                height={100}
                scale={{ x: 'time' }}
                padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                containerComponent={
                    <VictoryBrushContainer
                        // responsive={false}
                        brushDimension="x"
                        brushDomain={selected}
                        onBrushDomainChange={setSelected}
                    />
                }
                theme={VictoryTheme.material}
                domainPadding={30}
            >
                <VictoryAxis
                    tickValues={Array.apply(null, Array(24)).map(
                        (value, index) => {
                            let t = new Date()
                            t.setHours(index)
                            return t
                        }
                    )}
                    tickFormat={(x) => new Date(x).getHours()}
                />
                <VictoryBar
                    data={Array.apply(null, Array(24)).map((value, index) => {
                        let t = new Date()
                        t.setHours(index)
                        return {
                            x: t,
                            y: Math.floor(Math.random() * 10),
                        }
                    })}
                />
            </VictoryChart>
        </div>
    )
}
