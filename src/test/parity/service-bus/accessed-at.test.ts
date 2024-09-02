import { fixturedTest } from "test/fixtured-test.js"

fixturedTest(
  "accessedAt is updated on receiver open",
  async ({ onTestFinished, azure_queue, expect, expectCorrelatedTime }) => {
    const { sb_client, createQueue, getQueue } = azure_queue

    const queue = await createQueue({})

    expect(queue.accessedAt?.getTime()).toBeLessThan(0)

    const receiver = sb_client.createReceiver(queue.name!)
    onTestFinished(() => receiver.close())

    const receiveDate = new Date()
    await receiver.receiveMessages(1, {
      maxWaitTimeInMs: 0,
    })

    const { createdAt } = await getQueue(queue.name!)

    expect(createdAt).toBeDefined()
    expectCorrelatedTime(createdAt!, receiveDate)
  },
)

fixturedTest(
  "accessedAt is updated on message sent",
  async ({ onTestFinished, azure_queue, expect, expectCorrelatedTime }) => {
    const { sb_client, createQueue, getQueue } = azure_queue

    const queue = await createQueue({})

    expect(queue.accessedAt?.getTime()).toBeLessThan(0)

    const sender = sb_client.createSender(queue.name!)
    onTestFinished(() => sender.close())

    const sendDate = new Date()
    await sender.sendMessages({
      body: "hello world!",
    })

    const { createdAt } = await getQueue(queue.name!)

    expect(createdAt).toBeDefined()
    expectCorrelatedTime(createdAt!, sendDate)
  },
)