import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s - %(filename)s:%(lineno)d:%(funcName)s()] %(message)s",
)
logger = logging.getLogger(__name__)
