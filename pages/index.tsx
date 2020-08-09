import React, { useEffect, useState } from 'react'
import { H1, H3 } from 'baseui/typography'
import { Block } from 'baseui/block'
import {
    VictoryAxis,
    VictoryBar,
    VictoryBrushContainer,
    VictoryChart,
    VictoryLine,
    VictoryZoomContainer,
} from 'victory'
import { NewsType } from '../models/news.model'
import { Display4 } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'

export const TestGraph = ({ news }) => {
    const [zoom, setZoom] = useState({})
    const [selected, setSelected] = useState({})

    return (
        <div>
            <VictoryChart
                width={800}
                height={600}
                scale={{ x: 'time' }}
                containerComponent={
                    <VictoryZoomContainer
                        responsive={false}
                        zoomDimension="x"
                        zoomDomain={zoom}
                        onZoomDomainChange={setSelected}
                    />
                }
            >
                <VictoryLine
                    style={{
                        data: { stroke: 'tomato' },
                    }}
                    data={[
                        { x: new Date(1982, 1, 1), y: 125 },
                        { x: new Date(1987, 1, 1), y: 257 },
                        { x: new Date(1993, 1, 1), y: 345 },
                        { x: new Date(1997, 1, 1), y: 515 },
                        { x: new Date(2001, 1, 1), y: 132 },
                        { x: new Date(2005, 1, 1), y: 305 },
                        { x: new Date(2011, 1, 1), y: 270 },
                        { x: new Date(2015, 1, 1), y: 470 },
                    ]}
                />
            </VictoryChart>

            <VictoryChart
                width={800}
                height={90}
                scale={{ x: 'time' }}
                padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                containerComponent={
                    <VictoryBrushContainer
                        responsive={false}
                        brushDimension="x"
                        brushDomain={selected}
                        onBrushDomainChange={setZoom}
                    />
                }
            >
                <VictoryAxis
                    tickValues={[
                        new Date(1985, 1, 1),
                        new Date(1990, 1, 1),
                        new Date(1995, 1, 1),
                        new Date(2000, 1, 1),
                        new Date(2005, 1, 1),
                        new Date(2010, 1, 1),
                        new Date(2015, 1, 1),
                    ]}
                    tickFormat={(x) => new Date(x).getFullYear()}
                />
                <VictoryLine
                    style={{
                        data: { stroke: 'tomato' },
                    }}
                    data={[
                        { x: new Date(1982, 1, 1), y: 125 },
                        { x: new Date(1987, 1, 1), y: 257 },
                        { x: new Date(1993, 1, 1), y: 345 },
                        { x: new Date(1997, 1, 1), y: 515 },
                        { x: new Date(2001, 1, 1), y: 132 },
                        { x: new Date(2005, 1, 1), y: 305 },
                        { x: new Date(2011, 1, 1), y: 270 },
                        { x: new Date(2015, 1, 1), y: 470 },
                    ]}
                />
            </VictoryChart>
        </div>
    )
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
            <Block width={'70%'}>
                <H3>Time X frequency chart</H3>
                <br />
                {isLoaded.error ? (
                    <Display4 color={'negative'}>{isLoaded.error}</Display4>
                ) : !isLoaded.isLoaded ? (
                    <Spinner size={96} />
                ) : (
                    news.map((data) => (
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
                    ))
                )}
                <br />
                {/*<TestGraph news={news} />*/}
                <br />

                {}
            </Block>
        </Block>
    )
}
