import asyncio
import os
import logging
from uuid import uuid4
from dotenv import load_dotenv

from vision_agents.core import agents
from vision_agents.plugins import getstream, gemini
from vision_agents.core.edge.types import User
from vision_agents.core.events import(
    CallSessionParticipantJoinedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallSessionEndedEvent,
    PluginErrorEvent
)

from vision_agents.core.llm.events import(
    RealtimeUserSpeechTranscriptionEvent,
    LLMResponseChunkEvent
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

meeting_data={

    "transcript":[],
    "is_active":False,
}



async def start_agent(call_id: str):
    logger.info("STarting Meeting Assistant Agent...")
    logger.info(f"Using Call ID: {call_id}")

    agent=agents.Agent(

        edge = getstream.Edge(),

        agent_user=User(
            id="meeting-assistant-bot",
            name="Meeting Assistant Bot"
        ),

        instructions="You're a helpful AI assistant",

        llm=gemini.Realtime(fps=0),
    )
    


    meeting_data["agent"] = agent
    meeting_data["call_id"] = call_id


    @agent.events.subscribe
    async def handle_session_started(event: CallSessionStartedEvent):
        logger.info(f"Call session started")
        meeting_data["is_active"] = True
        logger.info("Meeting Started")


    await agent.create_user()
    call = agent.edge.client.video.call("default",call_id)

    logger.info("Joining Call...")

    with await agent.join(call):
        logger.info("Joined Call Successfully")
        logger.info("\n Features")
        logger.info("1. Auto-transcription")
        logger.info("2. Q&A (say 'Hey Assistant' + ask a question)")

        await agent.finish()

def print_meeting_summary():
    logger.info("Meeting Transcript Summary:")
    transcript = "\n".join(meeting_data["transcript"])
    logger.info(transcript)


if __name__ == "__main__":
    call_id = os.getenv("CALL_ID", f"meeting-{uuid4().hex[:8]}")

    try:
        asyncio.run(start_agent(call_id))
    
    except KeyboardInterrupt:
        logger.info("Shutting down Meeting Assistant Agent...")

    finally: 
        if meeting_data["transcript"]:
            print_meeting_summary()