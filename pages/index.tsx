import React, { useEffect, useState } from 'react'
import { Display4, Label1, H1, H3 } from 'baseui/typography'
import { Block } from 'baseui/block'
import { SIZE, StyledSpinnerNext } from 'baseui/spinner'
import { Grid, Cell } from 'baseui/layout-grid'
import { ArrowRight } from 'baseui/icon'
import { ALIGNMENT } from 'baseui/layout-grid'
import {
    VictoryAxis,
    VictoryBar,
    VictoryBrushContainer,
    VictoryChart,
} from 'victory'

import { NewsType } from '../models/news.model'
import { H5 } from 'baseui/typography/index'

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

    let newsParams = {
        pageSize: 90,
        statSize: 15,
    }

    useEffect(() => {
        fetch(
            `api/news?pageSize=${newsParams.pageSize}&statSize=${newsParams.statSize}`
        )
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
                <H3>Word X frequency chart</H3>
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
    }>({
        x: [
            new Date().setHours(new Date().getHours() - 4),
            new Date().setHours(new Date().getHours() - 1),
        ],
    })
    return (
        <div>
            {selected.x ? (
                <Block>
                    <VictoryChart
                        domainPadding={30}
                        width={1000}
                    >
                        <VictoryBar
                            x="word"
                            y="frequency"
                            data={calcWordFreq(
                                news,
                                new Date(selected.x[0]),
                                new Date(selected.x[1])
                            ).slice(-15)}
                            labels={({ datum }) => `${datum.frequency}`}
                            style={{
                                data: {
                                    fill: 'tomato',
                                    fillOpacity: 0.7,
                                },
                                labels: {
                                    fill: '#000',
                                },
                            }}
                        />
                        <VictoryAxis
                            label="Most popular words in the news cycle"
                            style={{
                                axisLabel: { padding: 35 },
                                ticks: { stroke: '#000', size: 5 },
                                tickLabels: { padding: 5 },
                            }}
                        />
                    </VictoryChart>
                    <br />
                    <Grid
                        align={ALIGNMENT.center}
                        overrides={{
                            Grid: {
                                style: () => ({
                                    justifyContent: 'center',
                                }),
                            },
                        }}
                    >
                        <Cell span={[3]}>
                            <H5 $style={{ textAlign: 'center' }} margin={0}>
                                <Label1 as={'span'}>
                                    {new Date(
                                        selected.x[0]
                                    ).toLocaleDateString()}
                                </Label1>
                                <br />
                                {new Date(selected.x[0]).toLocaleTimeString()}
                            </H5>
                        </Cell>
                        <Cell span={[1]}>
                            <ArrowRight size={48} />
                        </Cell>
                        <Cell span={[3]}>
                            <H5 $style={{ textAlign: 'center' }} margin={0}>
                                <Label1 as={'span'}>
                                    {new Date(
                                        selected.x[1]
                                    ).toLocaleDateString()}
                                </Label1>
                                <br />
                                {new Date(selected.x[1]).toLocaleTimeString()}
                            </H5>
                        </Cell>
                    </Grid>
                </Block>
            ) : (
                'pending'
            )}

            <br />
            {/* Scrub bar */}
            <VictoryChart
                width={1000}
                height={100}
                scale={{ x: 'time' }}
                padding={{ top: 0, left: 50, right: 50, bottom: 60 }}
                containerComponent={
                    <VictoryBrushContainer
                        brushDimension="x"
                        brushDomain={selected}
                        onBrushDomainChange={setSelected}
                        brushStyle={{ fill: 'tomato', opacity: 0.5 }}
                    />
                }
                domainPadding={30}
            >
                <VictoryAxis
                    tickValues={Array.apply(null, Array(24)).map(
                        (value, index) => {
                            let t = new Date()
                            t.setDate(t.getDate() - 1)
                            t.setHours(t.getHours() + index + 1)
                            return t
                        }
                    )}
                    tickFormat={(x) => new Date(x).getHours()}
                    style={{
                        axisLabel: { padding: 30 },
                        axis: { stroke: '#756f6a' },
                        grid: {
                            stroke: '#000',
                            strokeWidth: 0.5,
                            strokeDasharray: '5, 5',
                            opacity: 0.5,
                        },
                        ticks: { stroke: '#000', size: 5 },
                        tickLabels: { padding: 5 },
                    }}
                    label="Last 24 hours"
                />
            </VictoryChart>
        </div>
    )
}
